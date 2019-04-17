let div;    // Div with the RESPONSE HTML
let arrCategories;

function GETConvocatories( URL ) {
    // Make a call to url 
    return $.ajax({
        async: true,
        type: 'GET',
        url: URL
    });
}



