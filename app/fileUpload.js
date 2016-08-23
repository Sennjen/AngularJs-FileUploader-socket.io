app.directive('fileUpload', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        templateUrl: '/app/templates/file-upload.html',
        link: function(scope,element) {
            var socket = io.connect();
            var siofu = new SocketIOFileUpload(socket);

            // Configure the three ways that SocketIOFileUpload can read files:
            siofu.listenOnInput(element[0].querySelector("#upload_input"));

            siofu.addEventListener("start", function(event){
                element[0].querySelector(".alert-success").className = "alert alert-success hidden";
                element[0].querySelector(".alert-danger").className = "alert alert-danger hidden";
                element[0].querySelector('.progress-bar').setAttribute("style", "width: 0");
                element[0].querySelector(".progress").className = "progress progress-striped active";
            });
            // Do something on upload progress:
            siofu.addEventListener("progress", function(event){
                var percent = event.bytesLoaded / event.file.size * 100;
                element[0].querySelector('.progress-bar').setAttribute("style", "width: "+ percent +"%");
            });

            // Do something when a file is uploaded:
            siofu.addEventListener("complete", function(event){
                element[0].querySelector(".progress").className += " hidden";
                if(event.success){
                    element[0].querySelector("#file-name").innerHTML = event.file.name;
                    element[0].querySelector(".alert-success").className = "alert alert-success";
                    socket.emit('get files');
                }else{
                    element[0].querySelector(".alert-danger").className = "alert alert-danger";
                }
            });

            socket.emit('get files');
            socket.on('uploads', function (data) {
                element[0].querySelector(".table tbody").innerHTML = '';
                element[0].querySelector("#files-count").innerHTML = data.files.length;
                data.files.forEach(function (data,index) {
                    element[0].querySelector(".table tbody").innerHTML +=
                        '<tr><td>'+ (index+1) +'</td><td>'+ data +'</td></tr>'
                })
            })
        }
    };
});