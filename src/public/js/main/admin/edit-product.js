$(document).ready(function () {
    handleUploadImage();
    setCategoryOption();
    handleInputCurrency();
    addCategory();
    editProduct();
});

function handleUploadImage() {
    const imageContainer = $(".image-container");
    const imagePreview = $(".image-preview");
    const imageUpload = $(".image-upload");
    const uploadBtn = $(".upload-btn");
    const imageInput = $(imageUpload).find("#input-file");
    // Image preview
    imageInput.on("change", function (e) {
        const file = e.target.files[0];
        // console.log(file);
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function setCategoryOption() {
    const categorySelect = $("#category");
    const categoryData = $(categorySelect).data("category");
    console.log(categoryData);
    $.ajax({
        url: "/api/category",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("success");
            // data.forEach((category) => {
            //     categorySelect.append(`<option value="${category._id}">${category.name}</option>`);
            // });

            data.forEach((category) => {
                if (category._id === categoryData) {
                    categorySelect.append(`<option value="${category._id}" selected>${category.name}</option>`);
                } else {
                    categorySelect.append(`<option value="${category._id}">${category.name}</option>`);
                }
            });

        },
        error: function (error) {
            console.log(error);
        },
    });
}

function handleInputCurrency() {
    const itemFigures = $(".item-figure").find("input[type='number']");

    itemFigures.on("change", function (e) {
        let span = $(this).parent().parent().find("span");
        let value = $(this).val();
        let currency = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);

        span.text(currency);
    });

    itemFigures.on("input", function (e) {
        let span = $(this).parent().parent().find("span");
        let value = $(this).val();
        let currency = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);

        span.text(currency);
    });
}

function showToastMessage(status, message) {
    const alert = $("#alert");
    alert.classList = "";
    alert.addClass(`alert alert-dismissible text-white alert-${status} bg-${status}  border-0 fade show`);
    alert.find(".msg").text(message);
    alert.addClass("show");
    setTimeout(() => {
        alert.removeClass("show");
    }, 3000);
}

function clearInput() {
    $("#productname").val("");
    $("#importPrice").val("1");
    $("#retailPrice").val("1");
    $("#quantity").val("1");
    $("#description").val("");
    $("#input-file").val("");
    $(".image-preview").attr("src", "/images/no-image-available.png");
}

function addCategory() {
    const addCategoryForm = $("#addCategory");
    const addCategoryModal = $("#addCategoryModal");
    const buttonAddCategory = $(addCategoryForm).find(".button-add-category");
    const inputError = $(addCategoryForm).find(".error");

    // console.log(addCategoryForm, addCategoryModal, buttonAddCategory);

    buttonAddCategory.on("click", function (e) {
        e.preventDefault();
        const categoryName = $("#categoryName").val();
        if (!categoryName) {
            inputError.css("display", "block");
            inputError.text("Vui lòng nhập tên category");
            return;
        }

        $.ajax({
            url: "/api/category",
            type: "POST",
            data: {
                name: categoryName,
            },
            success: function (data) {
                console.log("success");
                // console.log(data);
                addCategoryModal.modal("hide");
                showToastMessage("success", "Thêm category thành công");
                $("#categoryName").val("");
                setCategoryOption();
            },
            error: function (error) {
                console.log(error);
            },
        });
    });
}

function editProduct() {
    const editButton = $("#button-edit-product");
    const confirmEditModal = $("#confirmEditModal");
    const confirmButton = $(confirmEditModal).find(".button-confirm");
    const categorySelect = $("#category");
    const imageInput = $(".image-upload").find("#input-file");
    const productId = $("#productId").val();
    // console.log(productId);

    let imageFile, name, importPrice, retailPrice, quantity, description, categoryId;

    editButton.on("click", function (e) {
        e.preventDefault();
        let formData = new FormData();
        imageFile = imageInput[0].files[0];
        name = $("#productname").val();
        importPrice = $("#importPrice").val();
        retailPrice = $("#retailPrice").val();
        quantity = $("#quantity").val();
        description = $("#description").val();
        categoryId = categorySelect.find("option:selected").attr("value");

        if (!name || !importPrice || !retailPrice || !quantity || !description || !categoryId) {
            confirmEditModal.modal("show");
            // set modal header to bg-danger
            $(confirmEditModal).find(".modal-header").classList = "";
            $(confirmEditModal).find(".modal-header").addClass("modal-header modal-colored-header bg-danger");
            $(confirmEditModal).find(".modal-body").text("Vui lòng nhập đầy đủ thông tin");
            confirmButton.css("display", "none");
            return;
        } else {
            confirmEditModal.modal("show");
            $(confirmEditModal).find(".modal-header").removeClass("bg-danger");
            $(confirmEditModal).find(".modal-header").addClass("bg-primary");
            $(confirmEditModal).find(".modal-body").text("Bạn có chắc muốn sửa sản phẩm này không?");
            confirmButton.css("display", "block");
        }

        // console.log(imageFile, name, importPrice, retailPrice, quantity, description, categoryId);

        formData.append("image", imageFile ? imageFile : "");
        formData.append("name", name);
        formData.append("importPrice", importPrice);
        formData.append("retailPrice", retailPrice);
        formData.append("quantity", quantity);
        formData.append("description", description);
        formData.append("category", categoryId);

        confirmButton.on("click", function (e) {
            e.preventDefault();
            $.ajax({
                url: "/api/product/" + productId,
                type: "PUT",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log("success");
                    // console.log(data);
                    confirmEditModal.modal("hide");
                    showToastMessage("success", "Sửa sản phẩm thành công");
                },
                error: function (error) {
                    console.log("error");
                    console.log(error);
                },
            });
        });
    });
}
