$('#ddlMonth').change( function() 
{
    GETCompetitions( this.value );
    clearFilters();
});

$('#btnSearch').click( function() 
{
   search();
   pagination ( null );
});

$('#btnClear').click( function() 
{
    clearFilters();
});

$('.btn-next').click( function() 
{
    pagination( 'next' );
});

$('.btn-prev').click( function() 
{
    pagination( 'prev' );
});

$('.btn-first').click( function() 
{
    pagination( 'first' );
});

$('.btn-last').click( function() 
{
    pagination( 'last' );
});


GETConvocatories (URL_CONVOCATORIES) .done( function( data ) 
{
    div = document.createElement("div");
    div.innerHTML = data;
    LOADConvocatories(div);
    init();
});

function init() 
{
    GETConvocatories( URL_CONVOCATORIES );
    LOADDays();
}

function LOADConvocatories(DOM) 
{
    Array.prototype.filter.call(DOM.getElementsByTagName('span'), function (el) {
        if (el.innerHTML.includes('Certámenes') && el.style.color == 'rgb(0, 102, 204)') {
            listConvocatories.push(el.innerHTML);
            $('#ddlMonth').append($('<option/>').val(el.innerHTML).text(el.innerHTML));
        }
    });

    GETCompetitions($('#ddlMonth').val());
}

function GETCompetitions(MONTH) 
{
    let ul = $(div).find('p:contains(' + MONTH + ') + ul');
    let childs = Array.from(ul[0].children);

        $('#competitions-deck').html("");
        mapCategories = new Map();
        listCompetitions = [];

        $(childs).each(function () {
            if (IsMonetaryPrize( this )) 
            {
                CREATECompetition( this );
            }
        });

        LOADCategories();
        searchResults = listCompetitions;

        pagination( null );
}

function CREATECompetition( li ) {

    let competition = {};

    let a = li.getElementsByTagName('a');
    let span = li.getElementsByTagName('span');
    let spanTxt = $(span[0]).text().split("/");
    let date = spanTxt[0].replace(/\(/g, '').replace(/:/g, '/');
    let title = $(a[0]).last().text();
    let emailImg = li.getElementsByTagName('img');  // If exists, accepts Email participation
    let acceptsEmail = emailImg[0] != null;
    let prize = spanTxt[2];
    let restrictions = spanTxt[3].replace(/\)/g, '') + ".";

    competition.title = title;
    competition.date = date;
    competition.restrictions = restrictions;
    competition.prize = prize;
    competition.url = $(a).attr('href');
    competition.acceptsEmail = acceptsEmail;

    let categories = spanTxt[1].split(",");   // One competition could belong to many categories
    let categoryKey;
    let categoryValue;
    competition.categories = [];
    $(categories).each(function (ind, data) 
    {
        categoryValue = data.trim().toTitleCase();   // To Title Case
        arrCategoryWords = categoryValue.split(" "); // Avoid for losing categories if starts with same word
        categoryKey = generateKey(categoryValue);    // Generate the key
        mapCategories.set(categoryKey, categoryValue);  // Add to the map
        
        competition.categories.push( categoryKey );
    });

    listCompetitions.push(competition);
    
}

function CREATECard( competition ) 
{
    let cardHTML = '<div class="col-md-4">';
    cardHTML += '<div class="card h-100 mb-2">';
    cardHTML += '   <div class="card-body position-relative">';
    cardHTML += '       <h6 class="card-title text-truncate" title="' + competition.title.escape() +'">';
    cardHTML += '           <a href="' + competition.url + '" target="_blank">' + competition.title + '</a>'
    cardHTML += '       </h6>';
    cardHTML += '       <div class="row">';
    cardHTML += '           <div class="col-sm-11">'
    cardHTML += '               <p class="card-text text-truncate" title="'+ competition.restrictions +'">' + competition.restrictions + '</p>';
    cardHTML += '           </div>';    // end col-sm-10
    cardHTML += '           <div class="col-sm-1">';
    if (competition.acceptsEmail) 
    {
        cardHTML += '           <span class="text-info text-right d-flex align-items-end h-100">';
        cardHTML += '               <i class="fas fa-envelope"></i>';
        cardHTML += '           </span>';
    } 
    cardHTML += '           </div>';    // End col-sm-2
    cardHTML += '       </div>';   // End row 
    cardHTML += '   </div>';   // End card-body 
    cardHTML += '   <div class="card-footer">';
    cardHTML += '       <div class="row">';
    cardHTML += '           <div class="col-sm-3 text-center">';
    cardHTML += '               <small class="text-muted">' + competition.date + '</small>';
    cardHTML += '           </div>';    // End col-sm-3
    cardHTML += '           <div class="col-sm-5 text-center text-truncate" title="'+ competition.prize +'">';
    cardHTML += '               <small class="text-muted">' + competition.prize + '</small>';
    cardHTML += '           </div>';    // End col-sm-5
    let categoriesStr = "";
    $(competition.categories).each(function (ind, key) 
    {
        categoriesStr += mapCategories.get(key);

        if (ind < competition.categories.length - 1 )
            categoriesStr += ' | ';
    });
    cardHTML += '           <div class="col-sm-4 text-center text-truncate" title="'+ categoriesStr +'">';
    cardHTML += '               <small class="text-muted"><span class="badge badge-info mr-1 p-1">' + competition.categories.length + '</span>' + categoriesStr + '</small></div></div>';
    cardHTML += '           </div>';    // End col-sm-4
    cardHTML += '       </div>';    // End row
    cardHTML += '   </div>';    // End card-footer
    cardHTML += ' </div>';    // End card
    cardHTML += ' </div>';    // End col-md-6

    $('#competitions-deck').append(cardHTML);

}

function LOADCategories() 
{
    $('#ddlCategory').html("");
    $('#ddlCategory').append($('<option/>').val("All").html("All"));    // Default option

    var mapAsc = new Map([...mapCategories.entries()].sort());  // Sort the map asc

    mapAsc.forEach(function (val, key) {
        $('#ddlCategory').append($('<option/>').val(key).html(val));
    });
}

function LOADDays() 
{
    for (let i=1; i<32; i++) {
        $('#ddlFromDay').append($('<option/>').val(i).text(i));
        $('#ddlToDay').append($('<option/>').val(i).text(i));
    }
    $('#ddlFromDay').val(new Date().getDate());
    $('#ddlToDay').val('31');
}

function IsMonetaryPrize(li) 
{
    let span = li.getElementsByTagName('span');
    return $(span[0]).text().includes("€");
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function (txt) { 
        return txt.length > 2 ? txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() : txt.toLowerCase()
    });
};

String.prototype.escape = function () {
    return this.replace(/\"/g, "\'");
}

function generateKey(str) {
    let words = str.split(' ');
    let key = '';

    $(words).each(function (ind, word) {
        if (word.length > 3) {
            key += word.substring(0, 3).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // Remove accents
            if (ind < words.length - 1) key += '_';
        }
    });

    return key;
}

function getKey(map, value) {
    return [map].find(([key, val]) => val == value)[0];
}

function search() 
{
    searchResults = listCompetitions;
    if ($('#ddlCategory').val() != 'All' ) searchByCategory($('#ddlCategory').val());
    searchByDay();
    if ($('#txtKeyword').val()) searchByKeyword($('#txtKeyword').val());
    //    refreshScreen( searchResults );
}

function searchByCategory(categoryKey) 
{
    console.log('searchByCategory: ' + categoryKey);
    let arrayToFilter = searchResults.length > 0 ? searchResults : listCompetitions;

    searchResults = arrayToFilter.filter(function(comp){
        return comp.categories.includes(categoryKey);
    });

}

function searchByDay() 
{
    console.log('searchByDay');
    let arrayToFilter = searchResults.length > 0 ? searchResults : listCompetitions;

    searchResults = arrayToFilter.filter(function(comp) {

        let compDay = Number(comp.date.substr(0, 2));
        let fromDay = Number($("#ddlFromDay").val());
        let toDay = Number($("#ddlToDay").val());

        return (compDay >= fromDay && compDay <= toDay);
    });

}

function searchByKeyword(keyword) 
{
    console.log('searchByKeyword' + keyword);
    let arrayToFilter = searchResults.length > 0 ? searchResults : listCompetitions;

    searchResults = arrayToFilter.filter(function(comp) {
        let containsKeyword = false;
        
        containsKeyword = comp.title.toLowerCase().includes(keyword);
        if (!containsKeyword) containsKeyword = comp.prize.toLowerCase().includes(keyword);
        if (!containsKeyword) containsKeyword = comp.restrictions.toLowerCase().includes(keyword);
        
        if (!containsKeyword) {
            $(comp.categories).each(function (ind, categoryKey) {
                let categoryName = mapCategories.get(categoryKey);
                containsKeyword = categoryName.toLowerCase().includes(keyword);
            });
        }
    
        return containsKeyword;
    });

}

function refreshScreen( competitions ) 
{
    let lblNumCompetitionsTxt = searchResults.length + " competitions for ";
    lblNumCompetitionsTxt +=  $('#ddlMonth').val() + ", ";
    let categorykey = $('#ddlCategory').val();
    let categoryName =  categorykey != "All" ? mapCategories.get(categorykey) : categorykey;
    lblNumCompetitionsTxt += "in category " + categoryName
     + ", ";
    lblNumCompetitionsTxt +=  "from day " + $('#ddlFromDay').val() + " ";
    lblNumCompetitionsTxt +=  "to day " + $('#ddlToDay').val();
    if ($('#txtKeyword').val()) 
        lblNumCompetitionsTxt +=  ', with keyword "' + $('#txtKeyword').val() + '".';
    else
        lblNumCompetitionsTxt +=  ".";
    
    $('#competitions-deck').html("");

    $(competitions).each(function(ind, competition) {
        CREATECard(competition);
    });

    $('#lblNumCompetitions').text( lblNumCompetitionsTxt );
}

function clearFilters() 
{
    $('#ddlCategory').val('All');
    $('#ddlFromDay').val(new Date().getDate());
    $('#ddlToDay').val('31');
    $('#txtKeyword').val('');
    searchResults = listCompetitions;
    pagination( null );
}

function pagination( order )
{
    let numPages = Math.ceil( searchResults.length / NUM_CARDS_PER_PAGE) ;

    switch ( order ) 
    {
        case 'prev':
            currentPage--;
            break;
        case 'next':
            currentPage++;
            break;
        case 'first':
            currentPage = 1;
            break;
        case 'last':
            currentPage = numPages;
            break;
        default:
            break;
    }
    
    offset = (currentPage - 1) * NUM_CARDS_PER_PAGE
   
    paginatedItems = searchResults.slice( offset ).slice( 0, NUM_CARDS_PER_PAGE);
    
    switch( currentPage )
    {
        case 1:
            $(".btn-prev").attr('disabled', 'true');
            $(".btn-first").attr('disabled', 'true');
            $(".btn-next").removeAttr('disabled');
            $(".btn-last").removeAttr('disabled');
            break;
        case numPages:
            $(".btn-next").attr('disabled', 'true');
            $(".btn-last").attr('disabled', 'true');
            $(".btn-prev").removeAttr('disabled');
            $(".btn-first").removeAttr('disabled');
            break;
        default:
            $(".btn-next").removeAttr('disabled');
            $(".btn-prev").removeAttr('disabled');
            $(".btn-first").removeAttr('disabled');
            $(".btn-last").removeAttr('disabled');
            break;
    }

    refreshScreen( paginatedItems );
    $( '.lbl-pagination' ).text ( 'Page ' +  currentPage + '/' + numPages );
}


