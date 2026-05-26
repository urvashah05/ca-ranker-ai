import { isLoggedIn } from '/js/storage.js'
if (!isLoggedIn()) window.location.replace('/pages/login.html')
