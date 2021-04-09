var filesToCache = [
'/',
'/index.html',
'/header.html',
'/footer.html',
'/content1.html',
'/content2.html',
'/js/buttons.html5.min.js',
'/js/dataTables.buttons.min.js',
'/js/header.js',
'/js/jquery-3.3.1.min.js',
'/js/jquery.dataTables.min.js',
'/js/jquery.easing.1.3.js',
'/js/jszip.min.js',
'/js/slick.js',
'/js/table_content_1.js',
'/js/table_style_manage.js',
'/js/table_users.js',
'/js/utill.js',

'/styles/common.css',
'/styles/jquery.dataTables.min.css',
'/styles/layout_main.css',
'/styles/layout.css',
'/styles/main.css',
'/styles/slick.css',

'/images/arrow_left1_over.png',
'/images/arrow_left1.png',
'/images/arrow_right1_over.png',
'/images/arrow_right1.png',
'/images/close1.png',
'/images/close2.png',
'/images/close3.png',
'/images/excel1.png',
'/images/excel2.png',
'/images/folder1.png',
'/images/house2_1.png',
'/images/house2.png',
'/images/house3.png',
'/images/image_rotate1.png',
'/images/image_rotate2.png',
'/images/info1.png',
'/images/key1.png',
'/images/key2.png',
'/images/logo-yjsoft-63x66.png',
'/images/menu1.png',
'/images/menu2.png',
'/images/menu3.png',
'/images/next1.png',
'/images/next2.png',
'/images/notice1.png',
'/images/pause1.png',
'/images/pause2.png',
'/images/play1.png',
'/images/previous1.png',
'/images/previous2.png',
'/images/search3.png',
'/images/share3.png',
'/images/solution1.png',
'/images/solution2.png',
'/images/solution3.png',
'/images/sort_asc.png',
'/images/sort_desc.png',
'/images/stop1.png',
'/images/stop2.png',
'/images/submenu3.png',
'/images/testbgt1.png',
'/images/user1.png',
'/images/user2.png',
'/images/userguide1.png',
'/images/visual_content1.png',
'/images/visual_link_1_3_1.png',
'/images/visual_link_1_3_2.png',
'/images/visual_text1.png',
'/images/visual_text2_2.png',
'/images/visual_text2.png',
'/images/worldmap1.png',
];


self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
      caches.open(cacheName).then(function(cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
      })
    );
}); 