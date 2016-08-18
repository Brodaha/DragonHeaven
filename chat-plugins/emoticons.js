'use strict';

const color = require('../config/color');
let demFeels = function () {};
demFeels.getEmotes = function () {
	return {};
};
try {
	demFeels = require('dem-feels');
} catch (e) {
	console.error(e);
}

exports.parseEmoticons = parseEmoticons;

// for travis build
if (typeof demFeels.extendEmotes === 'function') {
	// example extending emotes
	demFeels.extendEmotes({
		'(ditto)': 'https://cdn.betterttv.net/emote/554da1a289d53f2d12781907/2x',
		'#freewolf': 'http://i.imgur.com/ybxWXiG.png',
		'feelsbn': 'http://i.imgur.com/wp51rIg.png',
		'feelslugia': 'http://orig12.deviantart.net/3fa8/f/2011/211/9/8/98d68bd55eda5dd504b543cd35079dd5-d424a9r.gif',
		'feelscx':  'http://i.imgur.com/ZsTZ6WD.gif',
		'feelschar':  'http://i.imgur.com/TRnvzq0.gif',
		'feelslk':  'https://raw.githubusercontent.com/thearkguy/DHserver/master/config/avatars/thegodofhaxorus.gif',
		'feelslux':  'http://i.imgur.com/hDKCZMt.gif',
		'feelslatias':  'http://i.imgur.com/OPZuG3f.gif',
		'feelslatios': 'http://i.imgur.com/QCoBmpe.gif',
		'feelsvpn':  'http://i.imgur.com/ODTZISl.gif',
		'feelsabsol':  'http://i.imgur.com/v4l4e0o.gif',
		'zaa':'http://i.imgur.com/j4c4T0p.png',
		'feelsamph':'http://i.imgur.com/7VWktCg.gif',
		'feelsquirt':'http://i.imgur.com/kXqInoX.gif',
		'feelslitten': 'http://i.imgur.com/mXIxRKl.gif',
		'feelsumb': 'http://i.imgur.com/O7cudpK.gif',
		'feelswhim': 'http://i.imgur.com/ddJVotF.gif',
		'feelsfen':'http://i.imgur.com/9f39HYb.gif',
		'feelsshinx': 'http://i.imgur.com/HmGbocn.gif',
		'feelstini': 'http://i.imgur.com/mmUMAVI.gif',
		'feelscune': 'http://i.imgur.com/QOBU55D.gif',
		'feelssylv': 'http://i.imgur.com/o0CQTQw.gif',
		'feelszor': 'http://i.imgur.com/dZR0cF9.gif',
		'feelsrachi': 'http://i.imgur.com/go0Br3Z.gif',
		'feelsshumb': 'http://i.imgur.com/myIkCJd.gif',
		'feelstyph': 'http://i.imgur.com/2oL9Vcv.gif',
		'feelssab': 'http://i.imgur.com/SrUxt0o.gif',
		'lelelol': 'http://i.imgur.com/R2g0RHT.gif',
		'oshaswag': 'http://orig08.deviantart.net/a30d/f/2015/010/5/8/oshawott_swag_by_whatiget4beinganerd-d82v3br.gif',
		'feelsshzor': 'http://i.imgur.com/fvk0tKH.gif',
		'leleded': 'http://i.imgur.com/ht9m201.png',
		'stonedorf':'http://i.imgur.com/MRimwlB.png',
		'feelsrip':'http://i.imgur.com/ljl6Sfd.png',
		'feelspoak':'http://i.imgur.com/jElHTOv.png',
		'angryblanc': 'http://i.imgur.com/T5k0Tzq.png',
		'(kappa)': 'http://i.imgur.com/ZxRU4z3.png?1',
	});
}

const emotes = demFeels.getEmotes();

const emotesKeys = Object.keys(emotes).sort();

/**
* Parse emoticons in message.
*
* @param {String} message
* @param {Object} room
* @param {Object} user
* @param {Boolean} pm - returns a string if it is in private messages
* @returns {Boolean|String}
*/
function parseEmoticons(message, room, user, pm) {
	if (typeof message !== 'string' || (!pm && room.disableEmoticons)) return false;

	let match = false;
	let len = emotesKeys.length;

	while (len--) {
		if (message && message.indexOf(emotesKeys[len]) >= 0) {
			match = true;
			break;
		}
	}

	if (!match) return false;

	// escape HTML
	message = Tools.escapeHTML(message);

	// add emotes
	message = demFeels(message);

	// __italics__
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>');

	// **bold**
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>');

	let group = user.getIdentity().charAt(0);
	if (room.auth) group = room.auth[user.userid] || group;
	if (pm && !user.hiding) group = user.group;

	if (pm) return "<div class='chat' style='display:inline'>" + "<em class='mine'>" + message + "</em></div>";

	let style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";
	message = "<div class='chat'>" + "<small>" + group + "</small>" + "<button name='parseCommand' value='/user " + user.name + "' style='" + style + "'>" + "<b><font color='" + color(user.userid) + "'>" + user.name + ":</font></b>" + "</button><em class='mine'>" + message + "</em></div>";

	room.addRaw(message);
	return true;
}

/**
* Create a two column table listing emoticons.
*
* @return {String} emotes table
*/
function create_table() {
	let emotes_name = Object.keys(emotes);
	let emotes_list = [];
	let emotes_group_list = [];
	let len = emotes_name.length;

	for (let i = 0; i < len; i++) {
		emotes_list.push("<td style='padding: 5px; box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5) inset; border-radius: 5px;'>" + "<img src='" + emotes[emotes_name[i]] + "'' title='" + emotes_name[i] + "' height='50' width='50' style='vertical-align: middle;  padding-right: 5px;' />" + emotes_name[i] + "</td>");
	}

	for (let i = 0; i < len; i += 4) {
		let emoteOutput = [emotes_list[i], emotes_list[i + 1], emotes_list[i + 2], emotes_list[i + 3]];
		if (i < len) emotes_group_list.push("<tr>" + emoteOutput.join('') + "</tr>");
	}

	return (
		"<div class='infobox'><center><font style='font-weight: bold; text-decoration: underline; color: #555;'>List of Emoticons</font></center>" +
		"<div style='max-height: 300px; overflow-y: scroll; padding: 5px 0px;'><table style='background: rgba(245, 245, 245, 0.4); border: 1px solid #BBB;' width='100%'>" +
		emotes_group_list.join("") +
		"</table></div></div>"
	);
}

let emotes_table = create_table();

exports.commands = {
	blockemote: 'blockemoticons',
	blockemotes: 'blockemoticons',
	blockemoticon: 'blockemoticons',
	blockemoticons: function (target, room, user) {
		if (user.blockEmoticons === (target || true)) return this.sendReply("You are already blocking emoticons in private messages! To unblock, use /unblockemoticons");
		user.blockEmoticons = true;
		return this.sendReply("You are now blocking emoticons in private messages.");
	},
	blockemoticonshelp: ["/blockemoticons - Blocks emoticons in private messages. Unblock them with /unblockemoticons."],

	unblockemote: 'unblockemoticons',
	unblockemotes: 'unblockemoticons',
	unblockemoticon: 'unblockemoticons',
	unblockemoticons: function (target, room, user) {
		if (!user.blockEmoticons) return this.sendReply("You are not blocking emoticons in private messages! To block, use /blockemoticons");
		user.blockEmoticons = false;
		return this.sendReply("You are no longer blocking emoticons in private messages.");
	},
	unblockemoticonshelp: ["/unblockemoticons - Unblocks emoticons in private messages. Block them with /blockemoticons."],

	emotes: 'emoticons',
	emoticons: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReply("|raw|" + emotes_table);
	},
	emoticonshelp: ["/emoticons - Get a list of emoticons."],

	toggleemote: 'toggleemoticons',
	toggleemotes: 'toggleemoticons',
	toggleemoticons: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		room.disableEmoticons = !room.disableEmoticons;
		this.sendReply("Disallowing emoticons is set to " + room.disableEmoticons + " in this room.");
		if (room.disableEmoticons) {
			this.add("|raw|<div class=\"broadcast-red\"><b>Emoticons are disabled!</b><br />Emoticons will not work.</div>");
		} else {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Emoticons are enabled!</b><br />Emoticons will work now.</div>");
		}
	},
	toggleemoticonshelp: ["/toggleemoticons - Toggle emoticons on or off."],

	rande: 'randemote',
	randemote: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let rng = Math.floor(Math.random() * emotesKeys.length);
		let randomEmote = emotesKeys[rng];
		this.sendReplyBox("<img src='" + emotes[randomEmote] + "' title='" + randomEmote + "' height='50' width='50' />");
	},
	randemotehelp: ["/randemote - Get a random emote."],
};
