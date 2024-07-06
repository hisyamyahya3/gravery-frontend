function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error code:', error.code, 'Error message:', error.message)
            },
            {
                timeout: 10000,
                enableHighAccuracy: true
            }
        );
    })
}

register = async () => {
    const name = $('.regis-name').val()
    const username = $('.regis-username').val()
    const password = $('.regis-password').val()
    const role = $('.regis-as').val()
    const roleID = (role == "pelanggan") ? 1 : 2
    let latitude
    let longitude

    if (name == "" || username == "" || password == "" || roleID == "") {
        app.dialog.alert("Form Registrasi Ada yang Belum Diisi, Silahkan Diisi Terlebih Dahalu", "Error");
        return;
    }

    if (role == "pelanggan") {
        const position = await getLocation()
        latitude = position.latitude.toString()
        longitude = position.longitude.toString()
    }

    $.ajax({
        url: "https://gravery-api.vercel.app/api/register",
        method: "POST",
        data: {
            name: name,
            username: username,
            password: password,
            lat: latitude,
            long: longitude,
            roleID: roleID
        },
        success: function (result) {
            let message = result.message

            if (result.status != "ok") {
                return app.dialog.alert(message, "Info")
            }

            app.dialog.alert("Berhasil Registrasi, Silahkan Login Sesuai", "Info")

            app.views.main.router.navigate('/first/')
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error")
        }
    })
}

login = async () => {
    const username = $('.login-username').val();
    const password = $('.login-password').val();
    let latitude
    let longitude

    if (username == "" || password == "") {
        app.dialog.alert("Form Login Ada yang Belum Diisi, Silahkan Diisi Terlebih Dahalu", "Error");
        return;
    }

    $.ajax({
        url: "https://gravery-api.vercel.app/api/login",
        method: "POST",
        data: {
            username: username,
            password: password
        },
        success: async function (result) {
            let message = result.message

            if (result.status == "ok") {
                const position = await getLocation()
                localStorage.setItem("latitude", position.latitude);
                localStorage.setItem("longitude", position.longitude);
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
    app.dialog.confirm('Apakah Anda Yakin Ingin Keluar?', 'Info', function () {
        const isLogin = sessionStorage.getItem('isLogin')

        if (isLogin) {
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('customerId')
            app.views.main.router.navigate('/first/')
        }
    })
}