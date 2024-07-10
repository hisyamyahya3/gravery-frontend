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

orderHistory = () => {
    let customerID = sessionStorage.getItem("customerId");

    $.ajax({
        url: "https://gravery-api.vercel.app/api/order/history",
        method: "POST",
        data: { customer_id: customerID },
        success: function (result) {
            const data = result.data

            if (data == null) {
                return $('.ongoing-content-wrapper').html(`
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <h2>${result.message}</h2>
                        </div>
                    </div>
                `)
            }

            let template = ''

            data.forEach((d) => {
                template += `
                    <div class="card">
                        <div class="card-content card-content-padding">
                            <p>Nama Pelanggan : ${d.customer_name}</p>
                            <p>Tgl Dijemput : ${d.parsedPickedAt}</p>
                            <p>Berat (Dalam Kg): ${d.total_weight}</p>
                            <p>Total: ${rupiahFormatter(d.total)}</p>
                            <p>Nama Kurir : ${d.courier_name}</p>
                        </div>
                    </div>`
            })

            $('#order-history-content').html(template);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

function maps() {
    app.views.main.router.navigate('/maps/');
}

function orderdone() {
    app.views.main.router.navigate('/');
}
