$(document).ready(function () {
    // ------------------ Handle Datatable ------------------
    const productList = $("#products-datatable");
    const categoryList = $("#categories-datatable");
    let productTemp = [];
    const searchForm = $("#search");
    const valueInput = $(searchForm).find("input[name='keyword']");
    const searchBtn = $(searchForm).find("button#search-btn");

    function renderProduct() {
        $.ajax({
            url: "/api/product",
            method: "GET",
            async: false,
            success: function (data) {
                console.log(data)
                renderProducts(data, false);
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    function renderCategory() {
        $.ajax({
            url: "/api/category",
            method: "GET",
            async: false,
            success: function (data) {
                renderCategories(data);
            },
            error: function (err) {
                console.log(err.responseText);
            },
        });
    }

    function renderCategories(categories) {
        categoryList.empty();

        for (let i = 0; i < categories.length; i += 6) {
            const group = categories.slice(i, i + 6);
            const row = $('<div class="category-row"></div>');
            const button = $('<button></button>');
            button.addClass('btn btn-outline-primary btn-sm mr-2 mb-2 ms-2 active');
            button.text('All');
            button.attr('id', 'all');
            button.attr('name', 'all');
            row.append(button);
            group.forEach(category => {
                const button = $('<button></button>');
                button.addClass('btn btn-outline-primary btn-sm mr-2 mb-2 ms-2');
                button.text(category.name);
                button.attr('id', category._id);
                button.attr('name', category.name);
                row.append(button);
            });
            categoryList.append(row);
        }
    }

    function handleCategoryClick() {
        $('.category-row button').click(function () {
            // set active button
            $('.category-row button').removeClass('active');
            $(this).addClass('active');
            const categoryId = $(this).attr('id');
            if (categoryId === 'all') return renderProduct();
            $.ajax({
                url: '/api/category/' + categoryId,
                method: 'GET',
                success: function (category) {
                    renderProducts(category.products, false);
                },
                error: function (error) {
                    console.error('Error fetching products:', error);
                }
            });
        });
    }

    function renderProducts(products, search) {
        productList.empty();
        if (search === false) {
            productTemp = [];
        }
        for (let i = 0; i < products.length; i += 6) {
            const rowHtml = '<div class="row"></div>';
            const $row = $(rowHtml);
            for (let j = i; j < Math.min(i + 6, products.length); j++) {
                const product = products[j];
                if (search === false) {
                    productTemp.push(products[j]);
                }
                const productHtml = `
                    <div class="col-lg-2 col-md-2 col-sm-4 col-6 mb-3">
                        <div class="product mx-1">
                            <div class="product-image py-3">
                                <a href="/employee/product-details/${product._id}" class="product-overlay">
                                <img src="${product.image}" alt="" width="100%" /> </a>
                            </div>
                            <div class="product-info px-2">
                                <h6 class="product-name">${product.name}</h6>
                                <p class="product-price m-0 p-0">${formatNumber(product.retailPrice)} đ</p>
                                <p class="product-quanlity m-0 p-0">Rest: ${product.quantity}</p>
                            </div>
                        </div>
                    </div>
                `;
                const $product = $(productHtml);
                $row.append($product);
            }
            productList.append($row);
        }
    }

    function searchProduct() {
        let keyword;

        searchForm.submit(function (e) {
            e.preventDefault();
        });

        // event Enter
        $(valueInput).on("keydown", function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                keyword = $(valueInput).val();
                console.log("enter: ", keyword);
                execSearch(keyword);
                valueInput.val("");
            }
        });

        // event click
        $(searchBtn).on("click", function (e) {
            e.preventDefault();
            keyword = $(valueInput).val();
            console.log("click: ", keyword);
            execSearch(keyword);
            valueInput.val("");
        });
    }

    function execSearch(keyword) {
        let products = [];
        console.log(productTemp)
        if (keyword === "") {
            products = productTemp;
        } else {
            products = productTemp.filter((product) => {
                if (product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.category.toLowerCase().includes(keyword.toLowerCase()) ||
                    product._id.includes(keyword)
                ) {
                    return product;
                }
            });
        }
        renderProducts(products, true);
    }

    renderCategory();
    handleCategoryClick();
    renderProduct();
    searchProduct();
});

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}