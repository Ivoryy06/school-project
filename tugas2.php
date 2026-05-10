<?php
$studioChoice = 5;

echo "<h2>Studio Selection Results</h2>";

echo match ($studioChoice) {
    1 => "**Warner Bros.** - Showing: *The Batman*",
    2 => "**Universal Pictures** - Showing: *Oppenheimer*",
    3 => "**Walt Disney Studios** - Showing: *The Lion King*",
    4 => "**Sony Pictures** - Showing: *Spider-Man: Across the Spider-Verse*",
    5 => "**Paramount Pictures** - Showing: *Top Gun: Maverick*",
    6 => "**20th Century Studios** - Showing: *Avatar: The Way of Water*",
    7 => "**Lionsgate** - Showing: *John Wick: Chapter 4*",
    8 => "**A24** - Showing: *Everything Everywhere All At Once*",
    default => "Invalid Selection. Please choose a studio between 1 and 8.",
};
?>
