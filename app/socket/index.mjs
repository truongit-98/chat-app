import * as helper from "../helper/index.mjs";

export const ioServer = (io) => {

    io.of('/room').on('connection', socket => {

        socket.on('createNewChatRoom', async (roomName) => {
            const room = await helper.createNewRoom(roomName);
            if(room){
                socket.emit('addChatRoom', room);
            } else {
                socket.emit('errorMessage', 'Đã xảy ra lỗi, không thể thêm phòng mới.');
            }
        });
        
        socket.on('searchRoom', async (key) => {
            const rooms = await helper.searchRoomByName(key);
            socket.emit('renderChatRoom', rooms);
        })
    });


    io.of('/chat').on('connection', socket => {

        socket.on('join', data => {
            if(socket.rooms){
                Object.keys(socket.rooms).forEach((val, i)=>{
                    if(i > 0){
                        socket.leave(val);
                    }
                });
                socket.join(data, async () => {
                    const convs = await helper.getConversationsByRoomId(data);
                    socket.emit('renderDataMess', convs, socket.request.session?.passport?.user);
                });
            }
        });

        socket.on('newMessage', async (data) =>{
            if(socket.request.session?.passport?.user){
                data.userId = socket.request.session.passport.user;
                const convLatest = await helper.findConversationLatest();
                const conv = await helper.createNewConversation(data);
                const user = await helper.findUserByID(data.userId);
                let date = "";
                if(convLatest.length > 0){
                    date = new Date(conv.dateCreated).getHours() > new Date(convLatest[0].dateCreated).getHours() + 1 ? conv.dateCreated : ''
                } else {
                    date = conv.dateCreated;
                }
                
                socket.emit('appendMessage', conv.content, date);

                socket.broadcast.to(conv.room).emit('inMessage', {
                    mess: conv.content,
                    user: user,
                    date: date
                })
            }
        })


        // socket.on('disconnect', () => {
        //    // socket.disconect();
        // })
    });
}
