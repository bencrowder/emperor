# Emperor

Emperor is a Javascript script for embedding pedigree charts into blog posts. Requires jQuery.

## Usage

1. Link to `emperor.js` in the `<head>` element of your theme. (Also make sure you're including jQuery.)
2. In your blog posts, create pedigrees like this:

	<div class="emperor-pedigree">
		- John Doe | b. 1900
		-- Richard Doe | b. 1883
		--- Alazar Doe | b. 1850
		--- Mary Doe | b. 1853
		-- Annabelle Doe | b. 1881
		--- Jim Doe | b. 1853
	</div>

You can also prefix names with "Father:", "Mother:", "Grandfather:", or "Grandmother:", to make it easier to keep track of who's who. Example:

	<div class="emperor-pedigree">
		- John Doe | b. 1900
		-- Father: Richard Doe | b. 1883
		--- Grandfather: Alazar Doe | b. 1850
		--- Grandmother: Mary Doe | b. 1853
		-- Mother: Annabelle Doe | b. 1881
		--- Grandfather: Jim Doe | b. 1853
	</div>

It doesn't matter what character you use for the leader:

	<div class="emperor-pedigree">
		* John Doe | b. 1900
		## Father: Richard Doe | b. 1883
		++ Mother: Annabelle Doe | b. 1881
	</div>

Note: if you're using SmartyPants or some other typographical substitution script that will change two hyphens into an em-dash, you'll probably want to use another leader character.

You can also add newlines to the detail area by adding pipes:

	<div class="emperor-pedigree">
		- John Doe | 1900&ndash;1945 | San Diego, CA | Occupation: carpenter
		-- Father: Richard Doe | 1883&ndash;1933 | Occupation: lumberjack
		-- Mother: Annabelle Doe | 1881&ndash;1927 | Occupation: nurse
	</div>

## Styling

### General

* `div.emperor-pedigree` will let you style the container
* `div.emperor-pedigree table` will let you style the table used to lay out the pedigree chart

### People

* `div.emperor-pedigree .head` will let you style all of the names (the part above the line)
* `div.emperor-pedigree .tail` will let you style all of the details (the part below the line)

### Gender-specific

* `div.emperor-pedigree .male` will let you style the fathers and grandfathers (not the root)
* `div.emperor-pedigree .female` will let you style the mothers and grandmothers (not the root)

## Notes

Pedigree charts won't show up rendered when using a feed reader or Instapaper.

## License

Public domain.
