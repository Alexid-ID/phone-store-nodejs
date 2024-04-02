$(document).ready(function () {
    const filterTodayBtn = $('#filterToday');
    const filterYesterdayBtn = $('#filterYesterday');
    const filterWeekBtn = $('#filterWeek');
    const filterMonthBtn = $('#filterMonth');
    const filterInRangeBtn = $('#filterInRange');

    ajaxToday();

    filterTodayBtn.click(function () {
        ajaxToday();
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    });

    filterYesterdayBtn.click(function () {
        ajaxYesterday();
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    })

    filterWeekBtn.click(function () {
        ajaxWeek();
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    })

    filterMonthBtn.click(function () {
        ajaxMonth();
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    });

    filterInRangeBtn.click(function () {
        ajaxInRange();
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    });


});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderStatistic(data) {
    const numCustomers = $('#numCustomer');
    const numProducts = $('#numProduct');
    const numOrders = $('#numOrder');
    const numRevenue = $('#numRevenue');
    const invoiceTable = $('#invoiceTable').find('tbody');

    numCustomers.text(data.customerList.length);
    numOrders.text(data.invoices.length);
    numProducts.text(data.productList.length);
    numRevenue.text(formatNumber(data.revenue) + "đ");

    invoiceTable.empty();
    data.invoices.forEach(invoice => {
        const invoiceRow = $(`
            <tr>
                <td>
                    <h5 class="font-14 my-1 font-weight-normal">
                        ${invoice._id}
                    </h5>
                    <span class="text-muted font-13">
                        ${new Date(invoice.createdAt).toLocaleString()}
                    </span>
                </td>
                <td>
                    <h5 class="font-14 my-1 font-weight-normal"> ${invoice.customer.name} </h5>
                    <span class="text-muted font-13"> Customer </span>
                </td>
                <td>
                    <h5 class="font-14 my-1 font-weight-normal"> ${invoice.account.fullName}</h5>
                    <span class="text-muted font-13">Account </span>
                </td>
                <td>
                    <h5 class="font-14 my-1 font-weight-normal"> ${formatNumber(invoice.total)}đ </h5>
                    <span class="text-muted font-13">Total </span>
                </td>
                <td>
                    <a href="/admin/invoice/invoice-detail/${invoice._id}" class="btn btn-primary btn-sm">View</a>
                </td>
            </tr>
        `);
        invoiceTable.append(invoiceRow);
    });

}

function ajaxToday() {
    $.ajax({
        url: '/api/statistic/today',
        type: 'GET',
        success: function (data) {
            // console.log(data);
            renderStatistic(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function ajaxYesterday() {
    $.ajax({
        url: '/api/statistic/yesterday',
        type: 'GET',
        success: function (data) {
            // console.log(data);
            renderStatistic(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function ajaxWeek() {
    $.ajax({
        url: '/api/statistic/7-days',
        type: 'GET',
        success: function (data) {
            // console.log(data);
            renderStatistic(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function ajaxMonth() {
    $.ajax({
        url: '/api/statistic/month',
        type: 'GET',
        success: function (data) {
            // console.log(data);
            renderStatistic(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function ajaxInRange() {
    const startDate = $('#fromDate').val();
    const endDate = $('#toDate').val();
    console.log(startDate, endDate);
    $.ajax({
        url: '/api/statistic/in-range',
        type: 'POST',
        data: {
            fromDate: startDate,
            toDate: endDate
        },
        success: function (data) {
            // console.log(data);
            renderStatistic(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

