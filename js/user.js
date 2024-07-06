function detectLocation () {
    navigator.geolocation.getCurrentPosition(detectSucceed, detectFailed, {timeout: 7000, enableHighAccuracy: true});
}

function detectSucceed (position) {
    
}

function detectFailed(error) {
    app.dialog.alert(`Kode Error: ${error.code} - ${error.message}`,"Error");
}

function register() {
    let name = $('.regis-name').val();
    let username = $('.regis-username').val();
    let password = $('.regis-password').val();
    let lat =  position.coords.latitude;
    let long = position.coords.longitude;
    let role =  $('.regis-as').val();
    let roleID 
    if (role == "pelanggan"){
        detectLocation()
    } else {
        roleID = 2
    }
    if(name == "" || username == "" || password == "" || roleID == ""){
        app.dialog.alert("Form Registrasi Ada yang Belum Diisi, Silahkan Diisi Terlebih Dahalu","Error");
        return;
    }
    console.log(`lat ${lat} dan long ${long}`);
    return;
    //console.log(`${name} dan ${username} dan ${password} dan ${regisas}`);
    $.ajax({
        url: "https://gravery-api.vercel.app/api/register",
        method: "POST",
        data: {
            name: name,
            username: username,
            password: password,
            lat: lat,
            long: long,
            roleID: roleID
        },
        success: function (result) {
            let message = result.message
            console.log(result);
            if ( result.status == "ok" ){
                app.dialog.alert("Berhasil Registrasi, Silahkan Login Sesuai", "Info")
            } else {
                app.dialog.alert(message, "Info")
                return;
            }
            app.views.main.router.navigate('/first/');
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error")
        }
    })
}

function login() {
    let username = $('.login-username').val();
    let password = $('.login-password').val();
    if(username == "" || password == ""){
        app.dialog.alert("Form Login Ada yang Belum Diisi, Silahkan Diisi Terlebih Dahalu","Error");
        return;
    }

    $.ajax({
        url: "https://gravery-api.vercel.app/api/login",
        method: "POST",
        data: {
            username: username,
            password: password
        },
        success: function (result) {
            let message = result.message
            if ( result.status == "ok"){
                sessionStorage.setItem("isLogin", true)
                sessionStorage.setItem("username", result.data)
                app.views.main.router.navigate('/');
            } else {
                app.dialog.alert(message, "Info")
                return;
            }
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error")
        }
    })
}

async function logout() {
    app.dialog.confirm('Apakah Anda Yakin Ingin Keluar?','Info', function () {
        const isLogin = sessionStorage.getItem('isLogin')
    
        if (isLogin) {
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('customerId')
            app.views.main.router.navigate('/first/')
        }
    })
}