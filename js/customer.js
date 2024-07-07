createOrder = () => {
    let username = sessionStorage.getItem("username")
    let organic = localStorage.getItem("organic_size");
    let anorganic = localStorage.getItem("anorganic_size");

    $.ajax({
        url: "https://gravery-api.vercel.app/api/create-order",
        method: "POST",
        data: {
            username: username,
            organic_size: organic,
            anorganic_size: anorganic
        },
        success: function (result) {
            if (result.status == 'ok') {
                return app.views.main.router.navigate('/payment/');
            }

            app.dialog.alert(result.message, "Info")
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

makeOrder = () => {
    let organic = $('#organic').val();
    let anorganic = $('#anorganic').val();
    let organic_price = organic * 3000;
    let anorganic_price = anorganic * 5000;

    if (!organic && !anorganic) {
        return app.dialog.alert("Silahkan pilih jenis sampah organic atau anorganic terlebih dahulu!", "Info")
    }

    localStorage.setItem("organic_size", organic);
    localStorage.setItem("anorganic_size", anorganic);
    localStorage.setItem("organic_price", organic_price);
    localStorage.setItem("anorganic_price", anorganic_price);

    return app.views.main.router.navigate('/detail-order/');
}

function maps() {
    app.views.main.router.navigate('/maps/');
}

function orderdone() {
    app.views.main.router.navigate('/');
}
