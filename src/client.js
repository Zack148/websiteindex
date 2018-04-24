var axios = require('axios');

// Get random website from redis and open it in a new tab
window.randomWebsite = async function(nameOfList) {
  var newTab = window.open('/', '_blank');
  var response = await axios.post('/website', {
    list: nameOfList
  })
  newTab.location = response.data;
}
