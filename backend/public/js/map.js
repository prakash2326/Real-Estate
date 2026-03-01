
var map = L.map('serviceMap').setView([22.9734, 78.6569], 5); // India center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© OpenStreetMap'
}).addTo(map);

var locations = [
["Delhi",28.6139,77.2090],
["Ghaziabad",28.6692,77.4538],
["Jaipur",26.9124,75.7873],
["Vadodara",22.3072,73.1812],
["Chennai",13.0827,80.2707],
["Nagpur",21.1458,79.0882],
["Goa",15.2993,74.1240],
["Coimbatore",11.0168,76.9558],
["Noida",28.5355,77.3910],
["Faridabad",28.4089,77.3178],
["Udaipur",24.5854,73.7125],
["Mumbai",19.0760,72.8777],
["Bangalore",12.9716,77.5946],
["Indore",22.7196,75.8577],
["Kolkata",22.5726,88.3639],
["Patna",25.5941,85.1376],
["Hyderabad",17.3850,78.4867],
["Ahmedabad",23.0225,72.5714],
["Surat",21.1702,72.8311],
["Pune",18.5204,73.8567],
["Lucknow",26.8467,80.9462],
["Kanpur",26.4499,80.3319],
["Madurai",9.9252,78.1198]
];

locations.forEach(function(loc){
    L.marker([loc[1],loc[2]]).addTo(map)
     .bindPopup("<b>Car Transport in "+loc[0]+"</b>");
});

