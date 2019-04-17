let URL_CONVOCATORIES = "https://www.escritores.org/recursos-para-escritores/concursos-literarios"
let ENDPOINT_REST_SERVICE = "http://localhost:3000";

var competition = { title: null,    categories: [], date: null, restrictions: null, prize: null };

var category = {};

var listConvocatories = [];

var mapCategories = new Map();

var listCompetitions = [];

var searchResults = [];

var NUM_CARDS_PER_PAGE = 12;

var currentPage = 1;
