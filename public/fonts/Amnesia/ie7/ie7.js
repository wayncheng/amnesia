/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Amnesia\'">' + entity + '</span>' + html;
	}
	var icons = {
		'acon-bubble_chart': '&#xe6dd;',
		'acon-star': '&#xe901;',
		'acon-flash': '&#xe902;',
		'acon-point-of-interest': '&#xe903;',
		'acon-infinity': '&#xe904;',
		'acon-cog2': '&#xe905;',
		'acon-waves': '&#xe906;',
		'acon-star-outline': '&#xe907;',
		'acon-flash-outline': '&#xe908;',
		'acon-ac_unit': '&#xeb3b;',
		'acon-all_inclusive': '&#xeb3d;',
		'acon-attach_file': '&#xe226;',
		'acon-brightness_low': '&#xe1ad;',
		'acon-brightness_high': '&#xe1ac;',
		'acon-broken_image': '&#xe3ad;',
		'acon-camera': '&#xe3af;',
		'acon-change_history': '&#xe86b;',
		'acon-wb_cloudy': '&#xe42d;',
		'acon-directions_run': '&#xe566;',
		'acon-explore': '&#xe87a;',
		'acon-extension': '&#xe87b;',
		'acon-favorite': '&#xe87d;',
		'acon-filter_vintage': '&#xe3e3;',
		'acon-fingerprint': '&#xe90d;',
		'acon-games': '&#xe021;',
		'acon-gesture': '&#xe155;',
		'acon-my_location': '&#xe55c;',
		'acon-star2': '&#xe838;',
		'acon-grain': '&#xe3ea;',
		'acon-graphic_eq': '&#xe1b8;',
		'acon-group_work': '&#xe886;',
		'acon-home2': '&#xe88a;',
		'acon-hourglass_full': '&#xe88c;',
		'acon-language': '&#xe894;',
		'acon-layers': '&#xe53b;',
		'acon-local_hospital': '&#xe548;',
		'acon-room': '&#xe8b4;',
		'acon-looks': '&#xe3fc;',
		'acon-map2': '&#xe55b;',
		'acon-memory': '&#xe322;',
		'acon-more_horiz': '&#xe5d3;',
		'acon-more_vert': '&#xe5d4;',
		'acon-nature': '&#xe406;',
		'acon-navigation': '&#xe55d;',
		'acon-new_releases': '&#xe031;',
		'acon-notifications': '&#xe7f4;',
		'acon-pan_tool': '&#xe925;',
		'acon-person': '&#xe7fd;',
		'acon-pets': '&#xe91d;',
		'acon-polymer': '&#xe8ab;',
		'acon-radio_button_checked': '&#xe837;',
		'acon-rss_feed': '&#xe0e5;',
		'acon-school': '&#xe80c;',
		'acon-security': '&#xe32a;',
		'acon-send': '&#xe163;',
		'acon-settings': '&#xe8b8;',
		'acon-textsms': '&#xe0d8;',
		'acon-stars': '&#xe8d0;',
		'acon-style': '&#xe41d;',
		'acon-swap_calls': '&#xe0d7;',
		'acon-texture': '&#xe421;',
		'acon-touch_app': '&#xe913;',
		'acon-wb_sunny': '&#xe430;',
		'acon-wifi': '&#xe63e;',
		'acon-wifi_tethering': '&#xe1e2;',
		'acon-hand-o-up': '&#xf0a6;',
		'acon-hand-pointer-o': '&#xf25a;',
		'acon-diamond': '&#xf219;',
		'acon-bars': '&#xf0c9;',
		'acon-navicon': '&#xf0c9;',
		'acon-reorder': '&#xf0c9;',
		'acon-home': '&#xe900;',
		'acon-spades': '&#xe917;',
		'acon-clubs': '&#xe918;',
		'acon-diamonds': '&#xe919;',
		'acon-stack': '&#xe92e;',
		'acon-lifebuoy': '&#xe941;',
		'acon-map': '&#xe94b;',
		'acon-lock': '&#xe98f;',
		'acon-cog': '&#xe994;',
		'acon-trophy': '&#xe99e;',
		'acon-target': '&#xe9b3;',
		'acon-bookmark': '&#xe9d2;',
		'acon-sun': '&#xe9d4;',
		'acon-contrast': '&#xe9d5;',
		'acon-star-full': '&#xe9d9;',
		'acon-heart': '&#xe9da;',
		'acon-infinite': '&#xea2f;',
		'acon-command': '&#xea4e;',
		'acon-radio-checked': '&#xea54;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/acon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
