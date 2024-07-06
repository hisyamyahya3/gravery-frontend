function createOrder () {
    let customerId = sessionStorage.getItem("customerId")
    let organic = localStorage.getItem("organic_size");
    let anorganic = localStorage.getItem("anorganic_size");
    //app.dialog.alert(`Sampah Organik = ${organic}Kg dan Sampah Anorganik = ${anorganic}Kg dengan CustomerId = ${customerId}`)
    //app.views.main.router.navigate('/payment/');
    
    $.ajax({
        url: "https://gravery-api.vercel.app/api/create-order",
        method: "POST",
        data: {
            customer_id: customerId,
            organic_size: organic,
            anorganic_size: anorganic
        },
        success: function (result) {
            // console.log(result);
            // return;
            let message = result.message;
            app.dialog.alert(message, "Info")
            app.views.main.router.navigate('/payment/');
        },
        error: function () {
            app.dialog.alert("Tidak Terhubung dengan Server!", "Error");
        }
    })
}

function makeOrder () {
    let organic = $('#organic').val();
    let anorganic = $('#anorganic').val();
    let organic_price = organic * 3000;
    let anorganic_price = anorganic * 5000;
    localStorage.setItem("organic_size", organic);
    localStorage.setItem("anorganic_size", anorganic);
    localStorage.setItem("organic_price", organic_price);
    localStorage.setItem("anorganic_price", anorganic_price);
    app.views.main.router.navigate('/detail-order/');
}

function maps () {
    app.views.main.router.navigate('/maps/');
}

function orderdone () {
    app.views.main.router.navigate('/');
}
