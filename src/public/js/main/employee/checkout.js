$(document).ready(function () {
    searchBarcode();
    fetchProducts();
    checkout();
    handleCustomerInfo();


    // --------------------- Handle functions ---------------------
    function handleCustomerInfo() {
        const searchContainer = $(".customer-search");
        const customerInfo = $(".customer-info");
        const addCustomerBtn = $(searchContainer).find("#add-customer");
        const searchInput = $(searchContainer).find("input#phone");
        const searchResult = $(".customer-search-result");

        //     disable form input
        const customerInfoInput = $(".customer-info input");
        customerInfoInput.prop("disabled", true);

        searchInput.on("input", function (e) {
            e.preventDefault();
            const phone = $(this).val();
            console.log("search customer: ", phone);
            //clear form input
            customerInfoInput.val("");

            $.ajax({
                url: `/api/customer/${phone}`,
                method: "GET",
                success: function (response) {
                    console.log(response);
                    searchResult.removeClass("d-none");
                    searchResult.html("");
                    if (response) {
                        const {_id, name, phone, address} = response;
                        const customerHtml = `
                            <div class=" customer-search-item d-flex align-items-center justify-content-between">
                                    <div class="customer-search-item-info">
                                        <div class="customer-search-item-name">${name}</div>
                                        <div class="customer-search-item-phone">${phone}</div>
                                    </div>
                                    <div class="customer-search-item-action">
                                        <button class="btn btn-primary btn-select btn-sm">Select</button>
                                    </div>
                                </div>
                        `;

                        const $customer = $(customerHtml);
                        searchResult.append($customer);
                        $(".btn-select").on("click", function (e) {
                            e.preventDefault();
                            console.log("select customer");
                            $(customerInfo).data("id", _id);
                            $(customerInfo).find("input#name").val(name);
                            $(customerInfo).find("input#phone").val(phone);
                            $(customerInfo).find("input#address").val(address);
                            customerInfoInput.prop("disabled", true);
                            searchResult.addClass("d-none");
                        });
                    } else {
                        searchResult.html(`
                            <div class="d-flex justify-content-center">
                                <p class="text-danger">Cannot found customer with phone: ${phone}</p>
                            </div>
                        `);
                        customerInfoInput.prop("disabled", true);
                    }
                    //disable form input
                    customerInfoInput.prop("disabled", true);
                },
                error: function (err) {
                    console.log(err);
                },
            });
        });

        //blur customer search
        searchInput.on("blur", function (e) {
            console.log("blur")
            e.preventDefault();
            setTimeout(function () {
                searchResult.addClass("d-none");
            }, 1000);
        });

        addCustomerBtn.on("click", function (e) {
            e.preventDefault();
            // enable form input
            const name = $(customerInfo).find("input#name").val();
            const phone = $(customerInfo).find("input#phone").val();
            const address = $(customerInfo).find("input#address").val();
            if (!name && !phone && !address) {
                customerInfoInput.prop("disabled", function (i, v) {
                    return !v;
                });
            }
        });
    }


    function fetchProducts() {
        console.log("fetch");
        $.ajax({
            url: "/api/cart/cart-products",
            method: "GET",
            beforeSend: function () {
                $("#product-list").html(`
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden"></span>
                        </div>
                    </div>
                `);
            },
            success: function (response) {
                console.log(response);
                const productList = $("#product-list");
                productList.html("");
                let total = 0;

                response.products.forEach((product, index) => {
                    const {_id, name, retailPrice, image} = product;
                    let currentIndex = index + 1;
                    const quantity = response.total[index];
                    total += retailPrice * quantity;

                    const productHtml = `
                        <div class="product-item invoice-item" data-id="${product._id}">
                        <div class="">${currentIndex}</div>
                        <div class="d-flex align-items-center">
                            <img src="${product.image}" alt="" height="40px" width="auto"/>
                            <p class="m-0 ms-2">${product.name}</p>
                        </div>
                        <div class="retailPrice ${product._id}"  data-retail="${product.retailPrice}">${formatVND(product.retailPrice)}</div>
                        <div class="d-flex">
                            <div class="d-flex">
                                    <button class="btn btn-minus btn-sm" data-product-id="${product._id}">
                                        <i class='bx bx-minus'></i>
                                    </button>
                                    <input type="number" class="input-quantity quantity ${product._id}" value="${quantity}"
                                           min="1"
                                           style="width: 3rem;" data-product-id="${product._id}">
                                    <button class="btn btn-plus btn-sm" data-product-id="${product._id}">
                                        <i class='bx bx-plus'></i>
                                    </button>
                                </div>
                        </div>
                        <div class="total ${product._id}" data-total="${product.retailPrice * quantity}">
                            ${formatVND(product.retailPrice * quantity)}
                        </div>
                        <div class="action">
                            <button class="btn btn-danger btn-remove ${product._id} btn-sm" data-product-id="${product._id}">
                                <i class='bx bx-trash'></i>
                            </button>
                            <button class="btn btn-warning btn-confirm ${product._id} btn-sm d-none" data-product-id="${product._id}">
                                <i class='bx bx-check'></i>
                            </button>
                        </div>
                    </div>
                `;
                    const $product = $(productHtml);
                    productList.append($product);
                    getSubTotal();
                });

                const btnPlus = $(".btn-plus");
                const btnMinus = $(".btn-minus");
                const btnConfirm = $(".btn-confirm");

                registerChangeQuantity(btnPlus, btnMinus);
                registerConfirmUpdate(btnConfirm);
                registerRemove();

            },
            error: function (err) {
                console.log(err);
            },
        });
    }

    function registerChangeQuantity(btnPlus, btnMinus) {
        btnPlus.on("click", function (e) {
            e.preventDefault();
            const productId = $(this).data("product-id");
            const quantity = $(`.input-quantity.${productId}`).val();
            const total = $(`.total.${productId}`).data("total");
            const retailPrice = $(`.retailPrice.${productId}`).data("retail");

            $(`.input-quantity.${productId}`).val(parseInt(quantity) + 1);
            $(`.total.${productId}`).text(formatVND(total + parseInt(retailPrice)));
            $(`.total.${productId}`).data("total", total + parseInt(retailPrice));
            $(`.btn-confirm.${productId}`).removeClass("d-none");
            console.log("plus: ", productId, parseInt(quantity) + 1);

            getSubTotal();

        });

        btnMinus.on("click", function (e) {
            e.preventDefault();
            const productId = $(this).data("product-id");
            const quantity = $(`.input-quantity.${productId}`).val();
            const total = $(`.total.${productId}`).data("total");
            const retailPrice = $(`.retailPrice.${productId}`).data("retail");

            if (quantity > 1) {
                $(`.input-quantity.${productId}`).val(parseInt(quantity) - 1);
                $(`.total.${productId}`).text(formatVND(total - parseInt(retailPrice)));
                $(`.total.${productId}`).data("total", total - parseInt(retailPrice));
            }

            $(`.btn-confirm.${productId}`).removeClass("d-none");
            console.log("minus: ", productId, parseInt(quantity) - 1);

            getSubTotal();

        });

        $(".input-quantity").on("change", function (e) {
            e.preventDefault();
            const productId = $(this).data("product-id");
            $(`.btn-confirm.${productId}`).removeClass("d-none");

            // check if input is not a number
            if (isNaN(parseInt($(this).val()))) {
                $(this).val(1);
            }

            let quantity = parseInt($(this).val());
            if (quantity < 1) {
                $(this).val(1);
            }
            const total = $(`.total.${productId}`).data("total");
            const retailPrice = $(`.retailPrice.${productId}`).data("retail");

            $(`.total.${productId}`).text(formatVND(retailPrice * quantity));
            $(`.total.${productId}`).data("total", retailPrice * quantity);


            console.log("change: ", productId, parseInt($(this).val()));


            getSubTotal();

        })

    }

    function registerConfirmUpdate(btnConfirm) {

        btnConfirm.on("click", function () {
            const $this = $(this);

            const productId = $this.data("product-id");
            const quantity = $(`.input-quantity.${productId}`).val();

            const data = {
                id: productId,
                quantity,
            };

            console.log(data);
            $.ajax({
                url: "/api/cart/add-cart",
                method: "POST",
                data,
                success: function (response) {
                    console.log(response);
                    $this.addClass("d-none");

                    getSubTotal();

                },
                error: function (err) {
                    console.log(err);
                },
            });
        });
    }

    function registerRemove() {
        const btnRemove = $(".btn-remove");

        btnRemove.on("click", function () {
            console.log("remove");
            const productId = $(this).data("product-id");

            const data = {
                id: productId,
            };

            console.log(data);
            $.ajax({
                url: `/api/cart/cart-item`,
                method: "DELETE",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log(response);
                    fetchProducts();

                    getSubTotal();
                },
                error: function (err) {
                    console.log(err);
                },
            });
        });
    }


    function addProductToCart(data) {
        $.ajax({
            url: '/api/cart/add-cart',
            method: 'POST',
            data,
            success: async function (response) {
                console.log(response);

                getSubTotal();
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    function formatVND(price) {
        return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);
    }


    function searchBarcode() {
        const searchForm = $("#search");
        const barcodeInput = $(searchForm).find("input[name='keyword']");
        const searchBtn = $(searchForm).find("button#search-btn");
        let barcode;

        searchForm.submit(function (e) {
            e.preventDefault();
        });

        // event Enter
        $(barcodeInput).on("keydown", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                barcode = $(barcodeInput).val();
                console.log("enter: ", barcode);
                ajaxBarcodeSearch(barcode);

                getSubTotal();

                barcodeInput.val("");
            }
        });

        // event click
        $(searchBtn).on("click", function (e) {
            e.preventDefault();
            barcode = $(barcodeInput).val();
            console.log("click: ", barcode);
            ajaxBarcodeSearch(barcode);

            getSubTotal();

            barcodeInput.val("");
        });
    }


    function ajaxBarcodeSearch(keyword) {
        const productList = $("#product-list");
        const currentIndex = productList.children().length + 1;
        const searchError = $(".search-error");

        $.ajax({
            url: `/api/product/search/${keyword}`,
            method: "GET",
            async: false,
            success: function (data) {
                console.log(data);
                console.log(!data.status || !data);
                if (!data.status || !data) {
                    searchError.html("");
                    const product = data;
                    // find product with same id
                    const productItem = $(productList).find(".product-item[data-id='" + product._id + "']");
                    if (productItem.length > 0) {
                        const quantity = productItem.find(".quantity").val() ? parseInt(productItem.find(".quantity").val()) + 1 : 1;
                        productItem.find(".quantity").val(quantity);
                        productItem.find(".total").text(formatVND(product.retailPrice * quantity));
                        const data = {
                            id: product._id,
                            quantity: quantity
                        }

                        addProductToCart(data);
                    } else {
                        // create new product
                        const quantity = 1;
                        const productHtml = `
                        <div class="product-item invoice-item" data-id="${product._id}">
                            <div class="">${currentIndex}</div>
                            <div class="d-flex align-items-center">
                                <img src="${product.image}" alt="" height="40px" width="auto"/>
                                <p class="m-0 ms-2">${product.name}</p>
                            </div>
                            <div class="retailPrice ${product._id}" data-retail="${product.retailPrice}">${formatVND(product.retailPrice)}</div>
                            <div class="d-flex">
                                <div class="d-flex">
                                        <button class="btn btn-minus btn-sm" data-product-id="${product._id}">
                                            <i class='bx bx-minus'></i>
                                        </button>
                                        <input type="number" class="input-quantity quantity ${product._id}" value="${quantity}"
                                               min="1"
                                               style="width: 3rem;" data-product-id="${product._id}">
                                        <button class="btn btn-plus btn-sm" data-product-id="${product._id}">
                                            <i class='bx bx-plus'></i>
                                        </button>
                                    </div>
                            </div>
                            <div class="total ${product._id}" data-total="${product.retailPrice * quantity}">${formatVND(product.retailPrice * quantity)}</div>
                            <div class="action">
                                <button class="btn btn-danger btn-remove ${product._id} btn-sm" data-product-id="${product._id}">
                                    <i class='bx bx-trash'></i>
                                </button>
                                <button class="btn btn-warning btn-confirm ${product._id} btn-sm d-none" data-product-id="${product._id}">
                                    <i class='bx bx-check'></i>
                                </button>
                            </div>
                        </div>`;
                        const $product = $(productHtml);
                        productList.append($product);
                        const data = {
                            id: product._id,
                            quantity: quantity
                        }

                        addProductToCart(data);
                        const btnPlus = $(".btn-plus[data-product-id='" + product._id + "']");
                        const btnMinus = $(".btn-minus[data-product-id='" + product._id + "']");
                        const btnConfirm = $(".btn-confirm[data-product-id='" + product._id + "']");
                        registerChangeQuantity(btnPlus, btnMinus);
                        registerConfirmUpdate(btnConfirm);
                        registerRemove();
                    }

                } else {
                    searchError.html(
                        `<p class="text-danger">Cannot found product : ${keyword}</p>`
                    )
                }
                getSubTotal();


            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    function getSubTotal() {
        const totalValue = $("#total-value");
        const changeMoneyValue = $("#change-value");

        const productList = $("#product-list");
        const productItems = productList.children();
        const checkoutBtn = $("#checkout-btn");

        let sumMoney = 0;
        productItems.each(function () {
            const quantity = $(this).find(".quantity").val();
            const retailPrice = $(this).find(".retailPrice").data("retail");
            const totalProduct = parseInt(quantity) * parseInt(retailPrice);
            sumMoney += totalProduct;
        });
        totalValue.text(formatVND(sumMoney));
        console.log("subtotal: ", sumMoney);
        $(checkoutBtn).find("span.checkout-money-value").text(formatVND(sumMoney));

        const givenMoney = $("#given-money-value").data("money");
        if (givenMoney) {
            changeMoneyValue.text(formatVND(givenMoney - sumMoney));
        } else {
            changeMoneyValue.text(formatVND(0));
        }

        return sumMoney;
    }

    $("input[data-type='currency']").on({
        keyup: function () {
            const givenMoney = $(this).val();
            $("#given-money-value").data("money", parseInt(givenMoney));
            getSubTotal();
        },
        blur: function (e) {
            formatCurrency($(this));
        }
    });


    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    function formatCurrency(input) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.

        // get input value
        var input_val = input.val();

        // don't validate empty input
        if (input_val === "") {
            return;
        }

        // original length
        var original_len = input_val.length;

        // initial caret position
        var caret_pos = input.prop("selectionStart");

        // check for decimal
        if (input_val.indexOf(".") >= 0) {

            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");

            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);

            // add commas to left side of number
            left_side = formatNumber(left_side);

            // validate right side
            right_side = formatNumber(right_side);

            // On blur make sure 2 numbers after decimal
            if (blur === "blur") {
                right_side += "00";
            }

            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);

            // join number by .
            input_val = left_side + "." + right_side;

        } else {
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = input_val;
        }

        // send updated string to input
        input.val(input_val);

        // put caret back in the right position
        var updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }

    function checkout() {
        const checkoutBtn = $("#checkout-btn");
        const invoiceAlert = $("#invoiceAlert");
        let myModal = new bootstrap.Modal(document.getElementById('invoiceAlert'))
        checkoutBtn.on("click", function (e) {
            e.preventDefault();

            const givenMoney = $("#given-money-value").data("money");
            const employeeId = $(".employee-info").data("account");
            let products = [];
            const productItems = $("#product-list").children();
            productItems.each(function () {
                const productId = $(this).data("id");
                const quantity = $(this).find(".quantity").val();
                const product = {
                    product: productId,
                    quantity: parseInt(quantity)
                }
                products.push(product);
            });

            if (!employeeId) {
                myModal.show();
                $("#invoiceAlert").find(".modal-body").html(`
                   <p class="text-danger">Please login to checkout</p>
                `);
                return;
            }

            if (!givenMoney || givenMoney < getSubTotal()) {
                myModal.show();
                $("#invoiceAlert").find(".modal-body").html(`
                        <p class="text-danger">Please enter enough money</p>
                `);
                return;
            }


            if (products.length === 0) {
                myModal.show();
                $("#invoiceAlert").find(".modal-body").html(`
                     <p class="text-danger">Please add product to checkout</p>
                `);
                return;
            }

            const customer = $(".customer-info").data("id") ? $(".customer-info").data("id") : null;
            const name = $(".customer-info").find("input#name").val();
            const phone = $(".customer-info").find("input#phone").val();
            const address = $(".customer-info").find("input#address").val();

            if (!name || !phone || !address) {
                myModal.show();
                $("#invoiceAlert").find(".modal-body").html(`
                     <p class="text-danger">Please enter customer information</p>
                `);
                return;
            }

            const data = {
                account: employeeId,
                moneyGiven: givenMoney,
                customer: customer,
                name: name,
                phone: phone,
                address: address,
                products: products
            }

            console.log(data);
            $.ajax({
                url: "/api/invoice/add",
                method: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log(response);
                    if (response && !response.status) {
                        // myModal.show();
                        // $("#invoiceAlert").find(".modal-body").html(`
                        //     <p class="text-success">Checkout success</p>
                        // `);
                        window.location.href = `/employee/invoice/invoice-detail/${response._id}`;

                        //clear cart cookie
                        $.ajax({
                            url: "/api/cart/clear-cart",
                            method: "DELETE",
                            success: function (response) {
                                console.log(response);
                                fetchProducts();

                            },
                            error: function (err) {
                                console.log(err);
                            },
                        })

                    } else {
                        myModal.show();
                        $("#invoiceAlert").find(".modal-body").html(`
                            <p class="text-danger">Checkout fail</p>
                        `);
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });

        })
    }

});




