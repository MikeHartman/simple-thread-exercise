# simple-thread-exercise
Simple Thread Technical Exercise

The simplest way I can think of to treat this is how I'd probably do it without a computer (assuming I couldn't just eyeball it): mark off the days for each project on a calendar and use that to see where the gaps are. The naive code equivalent is probably iterating through every day in every project range "marking" it in a hash map. I'll do that, saving the low/high value in the map and only updating existing days if that value needs to increase. At the end I can sort the keys and iterate through them, checking for travel/full day by whether the previous and next days exist in the map. Definitely not very efficient with all those lookups, but I suspect it won't make a noticeable difference until we start processing much more data.

<a href="https://mikehartman.github.io/simple-thread-exercise/index.html">Run it</a>
