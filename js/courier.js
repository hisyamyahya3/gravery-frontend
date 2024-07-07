showListOrder = () => {
    const latitude = localStorage.getItem('latitude')
    const longitude = localStorage.getItem('longitude')

    $.ajax({
        url: "https://gravery-api.vercel.app/api/list-order",
        method: "POST",
        data: {
            lat: latitude,
            long: longitude
        },
        success: function (result) {
            let temp = ''

            result.data.forEach((d) => {
                if (!d.is_picked_up) {
                    temp += `<div class="card">
                                <div class="card-content card-content-padding">
                                    <h2 class="col" style="font-weight: bold;">${d.customer_name}</h2>
                                    <p>Total: ${rupiahFormatter(d.total)}</p>
                                    <p>Berat (Dalam Kg): ${d.total_weight}</p>
                                    <p>Jarak: ${d.distance} Km</p>
                                    <div class="left">
                                        <button class="button button-small button-tonal" onclick="detailPickup(${d.id})">Jemput</button>
                                    </div>
                                </div>
                            </div>`
                }
            })

            $('#list-order').html(temp);
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

showOngoing = () => {
    let courierId = sessionStorage.getItem("courierId");

    $.ajax({
        url: "https://gravery-api.vercel.app/api/ongoing-order",
        method: "POST",
        data: { courier_id: courierId },
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

            let orderTemplate = ''
            let detailOrderTemplate = ''

            data.forEach((d) => {
                orderTemplate += `<div class="card">
                            <div class="card-content card-content-padding">
                                <p>Nama Pelanggan: ${d.customer_name}</p>
                                <p>Alamat Pelanggan: ${d.customer_address}</p>
                                <p>Total: ${rupiahFormatter(d.total)}</p>
                                <p>Tanggal Order: ${d.parsedOrderDate}</p>
                                <div class="left">
                                    <button class="button button-small button-tonal" onclick="finishPickup(${d.id})">Selesaikan Pesanan</button>
                                </div>
                            </div>
                        </div>`

                d.orderItems.forEach((orderItems) => {
                    detailOrderTemplate += `<div class="card">
                                <div class="card-content card-content-padding">
                                    <h2 class="col" style="font-weight: bold;">Jenis Sampah: ${(orderItems.garbage_id == 1) ? 'Organic' : 'Anorganic'}</h2>
                                    <p>Berat (Dalam Kg): ${orderItems.weight}</p>
                                    <p>Harga: ${rupiahFormatter(orderItems.price)}</p>
                                </div>
                            </div>`
                })
            })

            $('.ongoing-content').removeClass('display-none')
            $('#ongoing-list-order').html(orderTemplate);
            $('#pickup-detail-orderitems').html(detailOrderTemplate)
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

detailPickup = (id) => {
    app.views.main.router.navigate(`/detail-pickup/${id}`);
}

makePickUp = (orderID) => {
    let courierId = sessionStorage.getItem("courierId");

    $.ajax({
        url: `https://gravery-api.vercel.app/api/pickup-order/${orderID}`,
        method: "POST",
        data: {
            courier_id: courierId,
        },
        success: function (result) {
            let message = result.message;
            app.dialog.alert(message, "Info")
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

detailOngoing = (id) => {
    app.views.main.router.navigate(`/detail-ongoing/${id}`);
}

finishPickup = (orderID) => {
    let courierId = sessionStorage.getItem("courierId");

    app.dialog.confirm('Apa kamu yakin ingin menyelesaikan pesanan ini?', 'Info', () => {
        $.ajax({
            url: `https://gravery-api.vercel.app/api/finish/pickup-order/${orderID}`,
            method: "POST",
            data: {
                courier_id: courierId,
            },
            success: function (result) {
                let message = result.message;
                app.dialog.alert(message, "Info")
                app.views.main.router.refreshPage()
            },
            error: function () {
                app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
            }
        })
    })
}