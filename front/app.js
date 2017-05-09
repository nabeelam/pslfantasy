var app = angular.module("myPSL", []);

app.controller("myC", function($scope){
    // $scope.teams = [
    // "Lahore",
    // "Peshawar",
    // "Quetta",
    // "Islamabad",
    // "Karachi"
    // ]

    $scope.toggle = function (Team) {
        $scope.activeTeam = Team.id;
    };

    // $scope.Teams = [
    //     {   
    //         id: 1,
    //         name: "Lahore Qalandars",
    //         players: ["Shahid", "Misbah", "Waqar"]},
    //     {
    //         id: 2,
    //         name: "Peshawar Zalmi",
    //         players: ["Asim", "Nabeel", "XYZ"]},
    //     {
    //         id: 3, 
    //         name: "Quetta Gladiators",
    //         players: ["Rohail", "Jamil", "ABC"]}
    //     {
    //         id: 4, 
    //         name: "Karachi Kings",
    //         players: ["Rohail", "Jamil", "ABC"]}
    //     {
    //         id: 3, 
    //         name: "Islamabad United",
    //         players: ["Rohail", "Jamil", "ABC"]}
    //     ]

    // random data
    $scope.Teams = [{ 
  "id": 1,
  "name": "Osinski-Halvorson",
  "players": [
    "Andie Spencley",
    "Rubin Rivers",
    "Dulcine Antunes",
    "Evelyn Haresnaip",
    "Courtney Presley",
    "Fran Featherbie",
    "Sonia Godwin",
    "Dyann Gantley",
    "Ludovika Blitzer",
    "Nate Easterling",
    "Sid Towndrow",
    "Jeramie MacDirmid",
    "Clementina Grimwade"
  ]
}, {
  "id": 2,
  "name": "Heaney and Sons",
  "players": [
    "Nellie Caron",
    "Heath Simoncelli",
    "Padgett Manuely",
    "Petunia Muddiman",
    "Jaimie Morfell",
    "Drucy Kidde",
    "Ingeborg Blowers",
    "Erna Benion",
    "Zacharias Lamberteschi",
    "Martita Winchester",
    "Stacy Koenen",
    "Loreen Bauldrey",
    "Harley Courtin"
  ]
}, {
  "id": 3,
  "name": "Spinka LLC",
  "players": [
    "Brittani Carlan",
    "Maurise Plom",
    "Constantina Plunkett",
    "Jessa Loxdale",
    "Beau Crossley",
    "Padriac Yare",
    "Jazmin Pautard",
    "Ignacio McCowan",
    "Yuma Fahy",
    "Ulysses Heard",
    "Malcolm Grundell",
    "Jelene Coombs",
    "Avivah Twoohy"
  ]
}, {
  "id": 4,
  "name": "Legros LLC",
  "players": [
    "Desdemona Biasotti",
    "Slade Derrick",
    "Danya Mallebone",
    "Bartlet Olligan",
    "Betti Vitler",
    "Sheela Hawkeswood",
    "Ursuline Davidovsky",
    "Ruprecht Melan",
    "Agnes Chander",
    "Bennie Wyllis",
    "Gabriela Cadalleder",
    "Maddie Worboy",
    "Sandor McGragh"
  ]
}, {
  "id": 5,
  "name": "McLaughlin-Kemmer",
  "players": [
    "Eolanda Donaghie",
    "Tremaine Cockill",
    "Sileas Stribling",
    "Filberte Buddell",
    "Arabelle Fleury",
    "Maurie Mcimmie",
    "Diana Sex",
    "Bart Gullis",
    "Cullan Brankley",
    "Peterus Chessum",
    "Emmit Wheal",
    "Bernadette Poole",
    "Hamil McAlees"
  ]
}]
});
