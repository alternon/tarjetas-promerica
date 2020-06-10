$( function() {
    //Cambio de texto en filtro
    $('.categoria').click(function(evt) {
        evt.preventDefault();
        $('.categoria').parent().removeClass("active");
        $(this).parent().addClass("active");
        $('#txt-categoria').html($(this).text());
        $(this).closest('.block-filtro-tarjetas').find(".icon-flecha").addClass("icon-flecha-mobile");
    });

    //Filtro esconder
    setTimeout(function() {
        $(".block-categorias-tdc").collapse('hide');
    }, 3000);



    //Detalle Tarjeta

    $('.box-more-info').append('<i class="icono icono-cerrar">');

    $('.box-info .btn-link.vermas').click(function(evt){
        evt.preventDefault();
        $('.box-more-info').removeClass("active");
        $(this).next().addClass("active");
    });

    $('.box-more-info .icono-cerrar').click(function(){
        $('.box-more-info').removeClass("active");
    });


    //Tab-Slider Promociones
    $(".promociones-slider-iconos a").click(function(){
        $(this).tab('show');
    });

});


enquire.register("screen and (max-width:992px)", {

    match : function() {

        $('.promociones-slider-iconos').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.promociones-slider-texto'
        });
        
        $('.promociones-slider-texto').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.promociones-slider-iconos',
            arrows: false,
            dots: true,
        });

        $('#txt-tarjeta-detalles').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
        });

        $('.slick-slider .slide').removeClass("fade");

        $(".promociones-slider-iconos a").click(function(evt){
            evt.preventDefault();
        });

        $(".promociones-slider-iconos li").addClass("active");
    },

    unmatch : function() {
        $('#txt-tarjeta-detalles').slick('unslick');
        $('.promociones-slider-iconos').slick('unslick');
        $('.promociones-slider-texto').slick('unslick');
        $('.slide').addClass("fade");

        $(".promociones-slider-iconos a").click(function(){
            $(this).tab('show');
        });
        $(".promociones-slider-iconos li:last-child").removeClass("active");
    }

});