<?php
$studioChoice = 5; 

echo "<h2>Studio Selection Results</h2>";

if ($studioChoice == 1) {
    echo "**Warner Bros.** - Showing: *The Batman*";
} 
else if ($studioChoice == 2) {
    echo "**Universal Pictures** - Showing: *Oppenheimer*";
} 
elseif ($studioChoice == 3) {
    echo "**Walt Disney Studios** - Showing: *The Lion King*";
} 
elseif ($studioChoice == 4) {
    echo "**Sony Pictures** - Showing: *Spider-Man: Across the Spider-Verse*";
} 
else if ($studioChoice == 5) {
    echo "**Paramount Pictures** - Showing: *Top Gun: Maverick*";
} 
elseif ($studioChoice == 6) {
    echo "**20th Century Studios** - Showing: *Avatar: The Way of Water*";
} 
else if ($studioChoice == 7) {
    echo "**Lionsgate** - Showing: *John Wick: Chapter 4*";
} 
elseif ($studioChoice == 8) {
    echo "**A24** - Showing: *Everything Everywhere All At Once*";
} 
else {
    echo "Invalid Selection. Please choose a studio between 1 and 8.";
}
?>