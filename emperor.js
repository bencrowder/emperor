// emperor.js
// by Ben Crowder
// 
// Emperor is a Javascript script for embedding pedigree charts into blog posts. Requires jQuery.
// 
// http://github.com/bencrowder/emperor

var Person = function() {
	var head = '';			// text for head
	var tail = '';			// text for tail	

	var gender = '';		// 'm' or 'f'

	var father;				// pointer to father object
	var mother;				// pointer to mother object
};

function add_cell(text, celltype, rowspan, boxtype, gender) {
	var output = '\t<td';

	if (rowspan > 1) {
		output += ' rowspan="' + rowspan + '"';
	}

	output += ' class="' + celltype;

	// left borders
	if (boxtype == 'father' && celltype == 'tail') { output += ' leftborder'; }
	if (boxtype == 'mother' && celltype == 'head') { output += ' leftborder'; }

	// gender
	if (gender == 'm') { output += ' male'; }
	if (gender == 'f') { output += ' female'; }

	// output += '">' + re.sub(r'\r', r'<br/>', text) + '</td>';
	output += '">' + text + '</td>';

	if (rowspan == 1) {
		output += '\n</tr>';
		if (boxtype != '') {
			output += '\n<tr>';
		}
	}

	return output;
}

function write_pedigree(person, cur_gen, n, boxtype) {
	var closerow = 0;
	var output = '';

	if (!person) {
		// for non-existent people
		person = new Person();
		person.head = '';
		person.tail = '';
	}

	if (boxtype == '') {
		output += '<table cellpadding="0" cellspacing="0" border="0">';
		output += '<tr>';
	}

	if (cur_gen == n) {
		closerow = 1;
	}

	output += add_cell(person.head, 'head', Math.pow(2, (n - cur_gen)), boxtype, person.gender);
	if (cur_gen < n) {
		output += write_pedigree(person.father, cur_gen + 1, n, 'father');
	}

	output += add_cell(person.tail, 'tail', Math.pow(2, (n - cur_gen)), boxtype, person.gender);
	if (cur_gen < n) {
		output += write_pedigree(person.mother, cur_gen + 1, n, 'mother');
	}

	if (boxtype == '') {
		output += '</table>';
	}

	return output;
}

$(document).ready(function() {
	$(".emperor-pedigree").each(function() {
		var num_generations = 1;	// total number of generations in this tree
		var last = [];				// stores the last people we parsed at each generation
		var last_gen = 1;			// the generation of the last line we parsed
		var rel = '';				// whether we're on the father or the mother

		// grab the content
		var content = $.trim($(this).html());
		var lines = content.split('\n');

		// parse
		for (var i in lines) {
			var line = $.trim(lines[i]);
			var leader = line[0];
			var cur_person = new Person();

			// count # of -'s at beginning of string and that becomes cur_gen
			var cur_gen = line.lastIndexOf(leader, line.indexOf(' ') + 1) + 1;
			
			if (cur_gen > 1) {
				if (last[cur_gen - 1].father) {
					rel = 'mother';
				} else {
					rel = 'father';
				}
			}

			// get the person's details
			var head = $.trim(line.substring(line.lastIndexOf(leader) + 1, line.indexOf('|')));
			if (head.substring(0, 7) == 'Father:') { rel = 'father'; head = $.trim(head.substring(8)); }
			else if (head.substring(0, 12) == 'Grandfather:') { rel = 'father'; head = $.trim(head.substring(13)); }
			else if (head.substring(0, 7) == 'Mother:') { rel = 'mother'; head = $.trim(head.substring(8)); }
			else if (head.substring(0, 12) == 'Grandmother:') { rel = 'mother'; head = $.trim(head.substring(13)); }
			cur_person.head = (head ? head : '');

			var tail = $.trim(line.substring(line.indexOf('|') + 1));
			tail = tail.replace(/ \| /g, '<br/>');
			cur_person.tail = (tail ? tail : '');

			if (cur_gen == 1) {
				// we're on the root person
				var root = cur_person;
				
				// for linking parents
				last[cur_gen] = cur_person;
			} else if (cur_gen > 1) {
				// check to see if we're on the father or the mother
				if (rel == 'father') {
					// father
					cur_person.gender = 'm';
					last[cur_gen - 1].father = cur_person;
					rel = '';
				} else if (rel == 'mother') {
					// mother
					cur_person.gender = 'f';
					last[cur_gen - 1].mother = cur_person;
					rel = '';
				}

				// for linking parents
				last[cur_gen] = cur_person;

				if (num_generations < cur_gen) { num_generations = cur_gen; }
			}
		}

		// generate HTML
		var htmlcontent = write_pedigree(root, 1, num_generations, '');

		// replace the div's contents with the generated HTML
		$(this).html(htmlcontent);

		// add css rules for the pedigree chart
		$('.emperor-pedigree table').css({ 'margin': '0px auto', 'padding': '0em 0px' });
		$('.emperor-pedigree .head').css({ 'vertical-align': 'bottom', 'border-bottom': 'solid 2px black', 'margin': '0px', 'padding': '10px 25px 3px 10px', 'font-weight': 'bold', 'letter-spacing': '-0.02em', 'min-width': '150px' });
		$('.emperor-pedigree .tail').css({ 'vertical-align': 'top', 'font-size': '.7em', 'margin': '0px', 'padding': '4px 25px 10px 10px', 'color': '#777' });
		$('.emperor-pedigree .leftborder').css({ 'border-left': 'solid 2px black', 'padding-left': '8px' });
	});
});
