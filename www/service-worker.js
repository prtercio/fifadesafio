self.addEventListener( 'activate', function( event ) {} );
self.addEventListener( 'fetch', function( event ) {} );
self.addEventListener( 'push', function( event ) {
	console.log( '[Service Worker] Push Received.' );
	console.log( `[Service Worker] Push had this data: "${event.data.text()}"` );
	const title = 'Push Goal Dare';
	const options = {
		body: 'Este é o corpo.',
		icon: 'imag/vitoria.png',
		badge: 'imag/empate.png'
	};
	event.waitUntil( self.registration.showNotification( title, options ) );
} );