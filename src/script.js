import Swal from "sweetalert2";

$(function() {

    // $.fn.inputFilter = function(inputFilter) {
    //     return this.on(
    //         "input keydown keyup mousedown mouseup select contextmenu drop",
    //         function() {
    //             if (inputFilter(this.value)) {
    //                 this.oldValue = this.value;
    //                 this.oldSelectionStart = this.selectionStart;
    //                 this.oldSelectionEnd = this.selectionEnd;
    //             } else if (this.hasOwnProperty("oldValue")) {
    //                 this.value = this.oldValue;
    //                 this.setSelectionRange(
    //                     this.oldSelectionStart,
    //                     this.oldSelectionEnd
    //                 );
    //             }
    //         }
    //     );
    // };

    // $(".quota-value input").inputFilter(function(value) {
    //     console.log(value);
    //     return /^\d*[.,]?\d{0,2}$/.test(value);
    // });

    var dataType = function(value, type_view = false) {
        let type = ["KB", "MB", "GB", "TB"];

        let mb = 1024;
        let inc = 0;
        let count = value;
        while (count >= mb) {
            count = count / mb;
            inc += 1;
        }

        let result = parseFloat(count).toFixed(2);

        if (type_view) result += " " + type[inc];

        return result;
    };

    $(document)
        .find(".btnLalala")
        .click(function() {
            let clone = $(".lalala").children()[0];
            // let clone = $('.lalala').clone().children().addClass('popup-quota-update')[0];
            console.log(clone);
            Swal.fire({
                title: "Are you sure?",
                text: "You be able to revert back later",
                type: "warning",
                html: clone,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33"
            });
        });

    var percentage = function(slider, max, percent = 100) {
        // console.log(max);
        return (slider / max) * 93;
    };
    var getValueChange = function(slider, value_change, type = true) {
        let value =
            slider >= value_change
                ? slider - value_change
                : value_change - slider;

        if (!type) return slider >= value_change ? value : -value;
        else
            return slider >= value_change
                ? dataType(value, true)
                : " - " + dataType(value, true);
    };

    $(document).on("keyup", ".popup-quota-update .quota-inputtext", function() {
        // console.log($(this).val());
        $("#swal-quota-slider").val($(this).val());
        $(".quota-box p").html(dataType($(this).val(), true));
        changeColorSlider(
            getValueChange($(this).val(), $(this).attr("data-default"), false)
        );

        $(document)
            .find(".popup-quota-update .pointer")
            .css(
                "left",
                percentage(
                    $(this).val(),
                    $(".popup-quota-update .quota-box").attr("data-max")
                ) + "%"
            );
        $(document)
            .find(".popup-quota-update .pointer span")
            .html(getValueChange($(this).val(), $(this).attr("data-default")));
        $(document)
            .find(".popup-quota-update #quota-hidden")
            .val(
                getValueChange(
                    $(this).val(),
                    $(this).attr("data-default"),
                    false
                )
            );
    });
    $(document).on(
        "change input",
        ".popup-quota-update #swal-quota-slider",
        function() {
            // console.log($(this).val());
            $(".quota-inputtext").val($(this).val());
            $(".quota-box p").html(dataType($(this).val(), true));

            $(".company-quota-box p").html(
                dataType(
                    $(".popup-quota-update .quota-box").attr("data-max") -
                        $(this).val(),
                    true
                )
            );

            changeColorSlider(
                getValueChange(
                    $(this).val(),
                    $(this).attr("data-default"),
                    false
                )
            );

            $(document)
                .find(".popup-quota-update .pointer")
                .css(
                    "left",
                    percentage(
                        $(this).val(),
                        $(".popup-quota-update .quota-box").attr("data-max")
                    ) + "%"
                );
            $(document)
                .find(".popup-quota-update .pointer span")
                .html(
                    getValueChange($(this).val(), $(this).attr("data-default"))
                );
            $(document)
                .find(".popup-quota-update #quota-hidden")
                .val(
                    getValueChange(
                        $(this).val(),
                        $(this).attr("data-default"),
                        false
                    )
                );
        }
    );
    $(document).on("mouseover", ".popup-quota-update .quota-box", function() {
        // console.log("over");
        $(".popup-quota-update .quota-inputtext-group").show();
        $(".popup-quota-update .quota-box p").hide();
    });
    $(document).on("mouseleave", ".popup-quota-update .quota-box", function() {
        // console.log("leave");
        $(".popup-quota-update .quota-inputtext-group").hide();
        $(".popup-quota-update .quota-box p").show();
    });

    var changeColorSlider = function(value) {
        var slider = $(document).find(".popup-quota-update .slider");
        var span = $(document).find(".pointer span");
        // console.log(value)

        if (value < 0) {
            // slider.css('background','red');
            span.css("color", "red");
        } else if (value > 0) {
            // slider.css('background','green');
            span.css("color", "green");
        } else {
            // slider.css('background','#d3d3d3');
            span.css("color", "#545454");
        }
    };

    $(document).on("focus", ".text-field-dynamic", function() {
        $(this)
            .parent()
            .find("label")
            .addClass("v-label--active");
        // console.log("v-label--active ");
    });

    $(document).on("focusout", ".text-field-dynamic", function() {
        if ($(this).val().length == 0)
            $(this)
                .parent()
                .find("label")
                .removeClass("v-label--active");
        // console.log("v-label--active ");
    });
});
