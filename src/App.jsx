import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Trophy, 
  ChevronUp, 
  ChevronDown,
  Clock,
  Facebook,
  Twitter,
  Copy,
  HelpCircle,
  X,
  AlertCircle,
  Keyboard,
  MousePointer2,
  Flame,
  Clapperboard
} from 'lucide-react';

// --- CONFIGURATION ---
const CONFIG = {
    gameUrl: "https://www.moviewhen.com" // https for better link previews
};

const MAX_GUESSES = 5;

// --- DATA COLLECTION ---
// Each entry: y = release year, h = [Star, Keyword, Vibe, Detail, Quote], s = title
const GAME_DATA = [
  // 1970s
  { y: 1970, h: ["Starring George C. Scott", "General", "Patriotic", "Tank", "Speech"], s: "Patton" },
  { y: 1970, h: ["Starring Donald Sutherland", "Hospital", "Mobile", "Korea", "Suicide is Painless"], s: "M*A*S*H" },
  { y: 1970, h: ["Starring Ali MacGraw", "Romance", "Tearjerker", "Harvard", "Love means never having to say you're sorry"], s: "Love Story" },
  { y: 1971, h: ["Starring Clint Eastwood", "Magnum", "Gritty", "Punk", "Do you feel lucky?"], s: "Dirty Harry" },
  { y: 1971, h: ["Starring Gene Hackman", "Drugs", "Subway", "Detective", "Porkpie Hat"], s: "The French Connection" },
  { y: 1971, h: ["Starring Malcolm McDowell", "Droogs", "Dystopian", "Milk Bar", "Viddy well"], s: "A Clockwork Orange" },
  { y: 1971, h: ["Starring Gene Wilder", "Chocolate", "Whimsical", "Golden Ticket", "Pure Imagination"], s: "Willy Wonka & the Chocolate Factory" },
  { y: 1972, h: ["Starring Marlon Brando", "Mafia", "Loyal", "Offer", "Horse Head"], s: "The Godfather" },
  { y: 1972, h: ["Starring Liza Minnelli", "Berlin", "Musical", "Decadent", "Kit Kat Klub"], s: "Cabaret" },
  { y: 1972, h: ["Starring Burt Reynolds", "River", "Survival", "Canoe", "Dueling Banjos"], s: "Deliverance" },
  { y: 1972, h: ["Starring Gene Hackman", "Capsized Ship", "Disaster", "New Year's Eve", "Upside Down"], s: "The Poseidon Adventure" },
  { y: 1973, h: ["Starring Linda Blair", "Possession", "Demonic", "Pea Soup", "Exorcism"], s: "The Exorcist" },
  { y: 1973, h: ["Starring Paul Newman", "Con", "Clever", "Poker", "The Entertainer"], s: "The Sting" },
  { y: 1973, h: ["Starring Richard Dreyfuss", "Cruising", "Nostalgic", "Hot Rods", "Rock 'n' Roll"], s: "American Graffiti" },
  { y: 1973, h: ["Starring Bruce Lee", "Martial Arts", "Tournament", "Island", "Nunchucks"], s: "Enter the Dragon" },
  { y: 1974, h: ["Starring Jack Nicholson", "Water", "Corrupt", "Noir", "Forget it, Jake"], s: "Chinatown" },
  { y: 1974, h: ["Starring Gene Wilder", "Brain", "Abnormal", "Monster", "Puttin' on the Ritz"], s: "Young Frankenstein" },
  { y: 1974, h: ["Starring Al Pacino", "Mafia", "Sequel", "Cuba", "Keep your friends close"], s: "The Godfather Part II" },
  { y: 1974, h: ["Starring Cleavon Little", "Western", "Spoof", "Campfire", "Beans"], s: "Blazing Saddles" },
  { y: 1974, h: ["Starring Steve McQueen", "Skyscraper", "Disaster", "Fire", "Party"], s: "The Towering Inferno" },
  { y: 1974, h: ["Starring Marilyn Burns", "Slasher", "Rural Texas", "Chainsaw", "Leatherface"], s: "The Texas Chain Saw Massacre" },
  { y: 1975, h: ["Starring Roy Scheider", "Shark", "Menacing", "Beach", "Bigger Boat"], s: "Jaws" },
  { y: 1975, h: ["Starring Tim Curry", "Transvestite", "Musical", "Alien", "Time Warp"], s: "Rocky Horror Picture Show" },
  { y: 1975, h: ["Starring Jack Nicholson", "Asylum", "Nurse", "Rebellion", "Chief"], s: "One Flew Over the Cuckoo's Nest" },
  { y: 1975, h: ["Starring Graham Chapman", "Knights", "Absurd", "Coconuts", "It's just a flesh wound"], s: "Monty Python and the Holy Grail" },
  { y: 1975, h: ["Starring Al Pacino", "Bank Robbery", "Tense", "Hostages", "Attica!"], s: "Dog Day Afternoon" },
  { y: 1976, h: ["Starring Sylvester Stallone", "Boxer", "Underdog", "Philly", "Adrian!"], s: "Rocky" },
  { y: 1976, h: ["Starring Robert De Niro", "Mohawk", "Lonely", "Taxi", "You talkin' to me?"], s: "Taxi Driver" },
  { y: 1976, h: ["Starring Sissy Spacek", "Prom", "Telekinesis", "Blood", "Bucket"], s: "Carrie" },
  { y: 1976, h: ["Starring Robert Redford", "Journalism", "Watergate", "Investigation", "Follow the money"], s: "All the President's Men" },
  { y: 1976, h: ["Starring Peter Finch", "Television", "Satire", "Anchorman", "I'm mad as hell"], s: "Network" },
  { y: 1976, h: ["Starring Gregory Peck", "Antichrist", "Horror", "666", "Damien"], s: "The Omen" },
  { y: 1976, h: ["Starring Walter Matthau", "Little League", "Underdogs", "Beer", "Coach Buttermaker"], s: "The Bad News Bears" },
  { y: 1977, h: ["Starring Mark Hamill", "Force", "Galactic", "Saber", "Death Star"], s: "Star Wars: A New Hope" },
  { y: 1977, h: ["Starring Diane Keaton", "Relationship", "Neurotic", "Lobster", "La-di-da"], s: "Annie Hall" },
  { y: 1977, h: ["Starring John Travolta", "Disco", "Dance", "White Suit", "Staying Alive"], s: "Saturday Night Fever" },
  { y: 1977, h: ["Starring Richard Dreyfuss", "UFO", "Wonder", "Mashed Potatoes", "Five Notes"], s: "Close Encounters of the Third Kind" },
  { y: 1977, h: ["Starring Burt Reynolds", "Trucker", "Chase", "Bootleg Beer", "CB Radio"], s: "Smokey and the Bandit" },
  { y: 1978, h: ["Starring Christopher Reeve", "Cape", "Heroic", "Krypton", "Flying"], s: "Superman" },
  { y: 1978, h: ["Starring John Travolta", "Car", "Musical", "Summer", "Grease Lightning"], s: "Grease" },
  { y: 1978, h: ["Starring Jamie Lee Curtis", "Mask", "Slasher", "Babysitter", "Michael"], s: "Halloween" },
  { y: 1978, h: ["Starring Robert De Niro", "Vietnam", "War", "Russian Roulette", "Steel Town"], s: "The Deer Hunter" },
  { y: 1978, h: ["Starring John Belushi", "Fraternity", "Raucous", "Toga Party", "Toga! Toga!"], s: "National Lampoon's Animal House" },
  { y: 1978, h: ["Starring Clint Eastwood", "Orangutan", "Brawler", "Trucker", "Right turn, Clyde"], s: "Every Which Way but Loose" },
  { y: 1979, h: ["Starring Sigourney Weaver", "Creature", "Terrifying", "Space", "Chestburster"], s: "Alien" },
  { y: 1979, h: ["Starring Martin Sheen", "Vietnam", "Insane", "Napalm", "The Horror"], s: "Apocalypse Now" },
  { y: 1979, h: ["Starring Sylvester Stallone", "Rematch", "Boxer", "Chicken", "Win"], s: "Rocky II" },
  { y: 1979, h: ["Starring Dustin Hoffman", "Divorce", "Custody", "French Toast", "Courtroom"], s: "Kramer vs. Kramer" },
  { y: 1979, h: ["Starring Graham Chapman", "Messiah", "Satire", "Sandal", "He's not the Messiah"], s: "Monty Python's Life of Brian" },
  { y: 1979, h: ["Starring Jim Henson", "Puppets", "Road Trip", "Hollywood", "Rainbow Connection"], s: "The Muppet Movie" },

  // 1980s
  { y: 1980, h: ["Starring Jack Nicholson", "Hotel", "Haunted", "Axe", "Here's Johnny!"], s: "The Shining" },
  { y: 1980, h: ["Starring Harrison Ford", "Father", "Dark", "Carbonite", "I am your father"], s: "The Empire Strikes Back" },
  { y: 1980, h: ["Starring Robert De Niro", "Boxer", "Black & White", "Jealousy", "Raging Bull"], s: "Raging Bull" },
  { y: 1980, h: ["Starring Leslie Nielsen", "Spoof", "Pilot", "Shirley", "Don't call me Shirley"], s: "Airplane!" },
  { y: 1980, h: ["Starring Chevy Chase", "Golf", "Comedy", "Gopher", "Be the ball"], s: "Caddyshack" },
  { y: 1980, h: ["Starring Betsy Palmer", "Summer Camp", "Slasher", "Crystal Lake", "Jason's Mother"], s: "Friday the 13th" },
  { y: 1981, h: ["Starring Harrison Ford", "Ark", "Adventurous", "Whip", "Snakes"], s: "Raiders of the Lost Ark" },
  { y: 1981, h: ["Starring Mel Gibson", "Post-apocalyptic", "Fuel", "Road", "Warrior"], s: "Mad Max 2: The Road Warrior" },
  { y: 1981, h: ["Starring Kurt Russell", "Prison City", "Dystopian", "Eyepatch", "Snake Plissken"], s: "Escape from New York" },
  { y: 1981, h: ["Starring David Naughton", "Werewolf", "Horror", "Moors", "Full Moon"], s: "An American Werewolf in London" },
  { y: 1981, h: ["Starring Bill Murray", "Army", "Comedy", "Basic Training", "That's a fact, Jack"], s: "Stripes" },
  { y: 1982, h: ["Starring Henry Thomas", "Alien", "Friendly", "Bicycle", "Phone Home"], s: "E.T." },
  { y: 1982, h: ["Starring Harrison Ford", "Replicant", "Dystopian", "Rain", "Tears in rain"], s: "Blade Runner" },
  { y: 1982, h: ["Starring Heather O'Rourke", "Ghosts", "TV", "Suburbs", "They're here"], s: "Poltergeist" },
  { y: 1982, h: ["Starring Sylvester Stallone", "Veteran", "Survival", "Knife", "Rambo"], s: "First Blood" },
  { y: 1982, h: ["Starring Kurt Russell", "Antarctica", "Paranoia", "Shapeshifter", "Blood Test"], s: "The Thing" },
  { y: 1982, h: ["Starring Dustin Hoffman", "Disguise", "Comedy", "Soap Opera", "Actor in a Dress"], s: "Tootsie" },
  { y: 1982, h: ["Starring Sylvester Stallone", "Boxer", "Rival", "Clubber Lang", "Eye of the Tiger"], s: "Rocky III" },
  { y: 1983, h: ["Starring Al Pacino", "Cocaine", "Violent", "Empire", "Little Friend"], s: "Scarface" },
  { y: 1983, h: ["Starring Tom Cruise", "Business", "Dance", "Sunglasses", "Old Time Rock and Roll"], s: "Risky Business" },
  { y: 1983, h: ["Starring Mark Hamill", "Ewoks", "Emperor", "Redemption", "It's a trap"], s: "Return of the Jedi" },
  { y: 1983, h: ["Starring Matthew Broderick", "Computer", "Cold War", "Hacking", "Shall we play a game?"], s: "WarGames" },
  { y: 1983, h: ["Starring Eddie Murphy", "Wall Street", "Comedy", "The Bet", "Looking good, Billy Ray!"], s: "Trading Places" },
  { y: 1983, h: ["Starring Peter Billingsley", "Christmas", "BB Gun", "Leg Lamp", "You'll shoot your eye out"], s: "A Christmas Story" },
  { y: 1984, h: ["Starring Arnold Schwarzenegger", "Cyborg", "Future", "Robot", "I'll be back"], s: "The Terminator" },
  { y: 1984, h: ["Starring Bill Murray", "Ghosts", "Slime", "Marshmallow", "Cross the streams"], s: "Ghostbusters" },
  { y: 1984, h: ["Starring Ralph Macchio", "Karate", "Wax", "Tournament", "Crane Kick"], s: "The Karate Kid" },
  { y: 1984, h: ["Starring Eddie Murphy", "Cop", "Beverly Hills", "Laugh", "Banana in tailpipe"], s: "Beverly Hills Cop" },
  { y: 1984, h: ["Starring Zach Galligan", "Creatures", "Christmas", "Mogwai", "Don't feed them after midnight"], s: "Gremlins" },
  { y: 1984, h: ["Starring Kevin Bacon", "Dancing", "Small Town", "Ban", "Cut loose"], s: "Footloose" },
  { y: 1984, h: ["Starring Barret Oliver", "Fantasy", "Luck Dragon", "The Book", "Falkor"], s: "The NeverEnding Story" },
  { y: 1985, h: ["Starring Michael J. Fox", "Delorean", "Retro", "Clock", "88 MPH"], s: "Back to the Future" },
  { y: 1985, h: ["Starring Sean Astin", "Treasure", "Pirate", "Caves", "Hey you guys!"], s: "The Goonies" },
  { y: 1985, h: ["Starring Emilio Estevez", "Detention", "High School", "Essay", "Simple Minds"], s: "The Breakfast Club" },
  { y: 1985, h: ["Starring Whoopi Goldberg", "The South", "Drama", "Letters", "Sisters"], s: "The Color Purple" },
  { y: 1985, h: ["Starring Tim Curry", "Mansion", "Whodunit", "The Butler", "Flames on the side of my face"], s: "Clue" },
  { y: 1985, h: ["Starring Sylvester Stallone", "Boxer", "Cold War", "Ivan Drago", "I must break you"], s: "Rocky IV" },
  { y: 1986, h: ["Starring Tom Cruise", "Jet", "Fast", "Volleyball", "Need for Speed"], s: "Top Gun" },
  { y: 1986, h: ["Starring Matthew Broderick", "Truant", "Chicago", "Parade", "Day Off"], s: "Ferris Bueller's Day Off" },
  { y: 1986, h: ["Starring Sigourney Weaver", "Marines", "Queen", "Loader", "Get away from her"], s: "Aliens" },
  { y: 1986, h: ["Starring Wil Wheaton", "Coming of Age", "Nostalgic", "Train Tracks", "The Body"], s: "Stand by Me" },
  { y: 1986, h: ["Starring Charlie Sheen", "Vietnam", "War", "Jungle", "Arms Raised"], s: "Platoon" },
  { y: 1986, h: ["Starring Jeff Goldblum", "Scientist", "Teleporter", "Transformation", "Be afraid"], s: "The Fly" },
  { y: 1987, h: ["Starring Patrick Swayze", "Dance", "Resort", "Lift", "Nobody puts Baby in a corner"], s: "Dirty Dancing" },
  { y: 1987, h: ["Starring Cary Elwes", "Fairy Tale", "Pirate", "Giant", "Inconceivable"], s: "The Princess Bride" },
  { y: 1987, h: ["Starring Mel Gibson", "Cops", "Partners", "Crazy", "Too old for this"], s: "Lethal Weapon" },
  { y: 1987, h: ["Starring Peter Weller", "Cyborg Cop", "Detroit", "Crime", "Dead or alive, you're coming with me"], s: "RoboCop" },
  { y: 1987, h: ["Starring Arnold Schwarzenegger", "Alien Hunter", "Jungle", "Commandos", "Get to the choppa"], s: "Predator" },
  { y: 1987, h: ["Starring Matthew Modine", "Marines", "Vietnam", "Boot Camp", "Drill Sergeant"], s: "Full Metal Jacket" },
  { y: 1987, h: ["Starring Michael Douglas", "Finance", "Greed", "Insider Trading", "Greed is good"], s: "Wall Street" },
  { y: 1988, h: ["Starring Bruce Willis", "Skyscraper", "Terrorist", "Vent", "Yippee-Ki-Yay"], s: "Die Hard" },
  { y: 1988, h: ["Starring Michael Keaton", "Ghost", "Bio-exorcist", "Model Town", "Say it 3 times"], s: "Beetlejuice" },
  { y: 1988, h: ["Starring Tom Hanks", "Piano", "Wish", "Fortune Teller", "Big"], s: "Big" },
  { y: 1988, h: ["Starring Dustin Hoffman", "Brothers", "Autism", "Las Vegas", "Definitely"], s: "Rain Man" },
  { y: 1988, h: ["Starring Bob Hoskins", "Cartoon", "Detective", "Toontown", "I'm not bad, I'm just drawn that way"], s: "Who Framed Roger Rabbit" },
  { y: 1988, h: ["Starring Warwick Davis", "Fantasy", "Sorcery", "The Baby", "Nelwyn"], s: "Willow" },
  { y: 1989, h: ["Starring Michael Keaton", "Joker", "Gothic", "Batmobile", "I'm Batman"], s: "Batman" },
  { y: 1989, h: ["Starring Rick Moranis", "Science", "Kids", "Tiny", "Lawn"], s: "Honey, I Shrunk the Kids" },
  { y: 1989, h: ["Starring Billy Crystal", "Friends", "New York", "Diner", "I'll have what she's having"], s: "When Harry Met Sally..." },
  { y: 1989, h: ["Starring Harrison Ford", "Holy Grail", "Adventure", "Father & Son", "He chose poorly"], s: "Indiana Jones and the Last Crusade" },
  { y: 1989, h: ["Starring Robin Williams", "Teacher", "Poetry", "Prep School", "O Captain! My Captain!"], s: "Dead Poets Society" },
  { y: 1989, h: ["Starring Jodi Benson", "Mermaid", "Ocean", "Voice", "Part of Your World"], s: "The Little Mermaid" },
  { y: 1989, h: ["Starring Bill Murray", "Ghosts", "Slime", "Statue of Liberty", "Pink Mood Slime"], s: "Ghostbusters II" },

  // 1990s
  { y: 1990, h: ["Starring Macaulay Culkin", "Burglars", "Christmas", "Traps", "Aftershave"], s: "Home Alone" },
  { y: 1990, h: ["Starring Arnold Schwarzenegger", "Mars", "Memory", "Spy", "Three boobies"], s: "Total Recall" },
  { y: 1990, h: ["Starring Julia Roberts", "Romance", "Business", "Shopping", "Big Mistake"], s: "Pretty Woman" },
  { y: 1990, h: ["Starring Patrick Swayze", "Afterlife", "Romance", "Pottery Wheel", "Ditto"], s: "Ghost" },
  { y: 1990, h: ["Starring Ray Liotta", "Mafia", "Crime", "Wiseguys", "Funny how?"], s: "Goodfellas" },
  { y: 1990, h: ["Starring Johnny Depp", "Suburbia", "Gothic", "Ice Sculptures", "Scissor Hands"], s: "Edward Scissorhands" },
  { y: 1991, h: ["Starring Anthony Hopkins", "Cannibal", "Psychological", "Lambs", "Chianti"], s: "Silence of the Lambs" },
  { y: 1991, h: ["Starring Robin Williams", "Peter Pan", "Pirate", "Flight", "Bangarang"], s: "Hook" },
  { y: 1991, h: ["Starring Anjelica Huston", "Gothic", "Family", "Hand", "Creepy and Kooky"], s: "The Addams Family" },
  { y: 1991, h: ["Starring Arnold Schwarzenegger", "Cyborg", "Liquid Metal", "Thumbs Up", "Hasta la vista, baby"], s: "Terminator 2: Judgment Day" },
  { y: 1991, h: ["Starring Paige O'Hara", "Enchanted Castle", "Romance", "The Rose", "Tale as old as time"], s: "Beauty and the Beast" },
  { y: 1991, h: ["Starring Kevin Costner", "Sherwood Forest", "Arrows", "The Sheriff", "(Everything I Do) I Do It for You"], s: "Robin Hood: Prince of Thieves" },
  { y: 1992, h: ["Starring Mike Myers", "Rock", "Cable Access", "Party", "Excellent"], s: "Wayne's World" },
  { y: 1992, h: ["Starring Whoopi Goldberg", "Nun", "Witness", "Choir", "Habit"], s: "Sister Act" },
  { y: 1992, h: ["Starring Robin Williams", "Genie", "Magic Lamp", "Flying Carpet", "A Whole New World"], s: "Aladdin" },
  { y: 1992, h: ["Starring Tom Cruise", "Military", "Courtroom", "Code Red", "You can't handle the truth"], s: "A Few Good Men" },
  { y: 1992, h: ["Starring Harvey Keitel", "Heist", "Suits", "Color Names", "Mr. Pink"], s: "Reservoir Dogs" },
  { y: 1992, h: ["Starring Michael Keaton", "Penguin", "Catwoman", "Gotham", "Mistletoe"], s: "Batman Returns" },
  { y: 1993, h: ["Starring Sam Neill", "Dinosaur", "Park", "Amber", "Life finds a way"], s: "Jurassic Park" },
  { y: 1993, h: ["Starring Robin Williams", "Nanny", "Divorce", "Disguise", "Run-by fruiting"], s: "Mrs. Doubtfire" },
  { y: 1993, h: ["Starring Bill Murray", "Time Loop", "Winter", "Reporter", "Punxsutawney"], s: "Groundhog Day" },
  { y: 1993, h: ["Starring Liam Neeson", "Holocaust", "Black & White", "The Red Coat", "The List"], s: "Schindler's List" },
  { y: 1993, h: ["Starring Danny Elfman", "Halloween", "Stop-Motion", "Pumpkin King", "This is Halloween"], s: "The Nightmare Before Christmas" },
  { y: 1993, h: ["Starring Sylvester Stallone", "Mountains", "Heist", "Rescue", "The Rockies"], s: "Cliffhanger" },
  { y: 1994, h: ["Starring John Travolta", "Dance", "Crime", "Burger", "Royale with Cheese"], s: "Pulp Fiction" },
  { y: 1994, h: ["Starring Tom Hanks", "Bench", "Simple", "Box of Chocolates", "Run Forrest"], s: "Forrest Gump" },
  { y: 1994, h: ["Starring Keanu Reeves", "Bus", "Bomb", "50 MPH", "Pop Quiz"], s: "Speed" },
  { y: 1994, h: ["Starring Matthew Broderick", "Lion", "King", "Circle", "Hakuna Matata"], s: "The Lion King" },
  { y: 1994, h: ["Starring Tim Robbins", "Prison", "Hope", "Rock Hammer", "Get busy living"], s: "The Shawshank Redemption" },
  { y: 1994, h: ["Starring Jim Carrey", "Green Face", "Cartoonish", "Zoot Suit", "Ssssmokin'!"], s: "The Mask" },
  { y: 1994, h: ["Starring Jim Carrey", "Road Trip", "Idiots", "Briefcase", "So you're telling me there's a chance"], s: "Dumb and Dumber" },
  { y: 1994, h: ["Starring Arnold Schwarzenegger", "Spy", "Double Life", "Harrier Jet", "Tango"], s: "True Lies" },
  { y: 1995, h: ["Starring Tom Hanks", "Cowboy", "Animated", "Spaceman", "Infinity and Beyond"], s: "Toy Story" },
  { y: 1995, h: ["Starring Robin Williams", "Board Game", "Jungle", "Drums", "Stampede"], s: "Jumanji" },
  { y: 1995, h: ["Starring Tom Hanks", "Space", "NASA", "Moon", "Houston we have a problem"], s: "Apollo 13" },
  { y: 1995, h: ["Starring Brad Pitt", "Serial Killer", "Grim", "Seven Sins", "What's in the box?"], s: "Se7en" },
  { y: 1995, h: ["Starring Mel Gibson", "Scotland", "War", "Face Paint", "Freedom!"], s: "Braveheart" },
  { y: 1995, h: ["Starring Al Pacino", "Heist", "Cops & Robbers", "Los Angeles", "Diner Showdown"], s: "Heat" },
  { y: 1996, h: ["Starring Will Smith", "Alien", "Invasion", "July 4th", "Welcome to Earth"], s: "Independence Day" },
  { y: 1996, h: ["Starring Michael Jordan", "Basketball", "Cartoon", "Aliens", "Monstars"], s: "Space Jam" },
  { y: 1996, h: ["Starring Helen Hunt", "Tornado", "Storm", "Cow", "The Suck Zone"], s: "Twister" },
  { y: 1996, h: ["Starring Neve Campbell", "Slasher", "Meta", "Ghostface", "What's your favorite scary movie?"], s: "Scream" },
  { y: 1996, h: ["Starring Frances McDormand", "Kidnapping", "Snowy", "Woodchipper", "You betcha"], s: "Fargo" },
  { y: 1996, h: ["Starring Tom Cruise", "Spy", "Ceiling Drop", "The Mask", "This message will self-destruct"], s: "Mission: Impossible" },
  { y: 1997, h: ["Starring Leonardo DiCaprio", "Ship", "Iceberg", "Romantic", "King of the World"], s: "Titanic" },
  { y: 1997, h: ["Starring Will Smith", "Aliens", "Suit", "Memory", "Galaxy Defender"], s: "Men in Black" },
  { y: 1997, h: ["Starring Mike Myers", "Spy", "Frozen", "Teeth", "Groovy"], s: "Austin Powers: International Man of Mystery" },
  { y: 1997, h: ["Starring Matt Damon", "Genius", "Boston", "Therapy", "How do you like them apples?"], s: "Good Will Hunting" },
  { y: 1997, h: ["Starring Bruce Willis", "Future", "Flying Taxi", "Opera", "Multipass"], s: "The Fifth Element" },
  { y: 1997, h: ["Starring Harrison Ford", "President", "Hijack", "Air Force One", "Get off my plane"], s: "Air Force One" },
  { y: 1998, h: ["Starring Jim Carrey", "Reality TV", "Dome", "Show", "Good morning!"], s: "The Truman Show" },
  { y: 1998, h: ["Starring Eddie Murphy", "Dragon", "China", "War", "Reflection"], s: "Mulan" },
  { y: 1998, h: ["Starring Tom Hanks", "WWII", "D-Day", "Normandy Beach", "Earn this"], s: "Saving Private Ryan" },
  { y: 1998, h: ["Starring Jeff Bridges", "Bowling", "Slacker", "The Rug", "The Dude abides"], s: "The Big Lebowski" },
  { y: 1998, h: ["Starring Bruce Willis", "Asteroid", "Space", "Oil Drillers", "Sacrifice"], s: "Armageddon" },
  { y: 1998, h: ["Starring Jackie Chan", "Buddy Cops", "Kidnapping", "Los Angeles", "Do you understand the words coming out of my mouth?"], s: "Rush Hour" },
  { y: 1999, h: ["Starring Keanu Reeves", "Simulation", "Bullet", "Pill", "The One"], s: "The Matrix" },
  { y: 1999, h: ["Starring Brendan Fraser", "Egypt", "Curse", "Sand", "Imhotep"], s: "The Mummy" },
  { y: 1999, h: ["Starring Kevin Spacey", "Suburbs", "Midlife Crisis", "Rose Petals", "Plastic Bag"], s: "American Beauty" },
  { y: 1999, h: ["Starring Brad Pitt", "Underground Club", "Twist", "Soap", "First rule of Fight Club"], s: "Fight Club" },
  { y: 1999, h: ["Starring Bruce Willis", "Ghosts", "Twist", "Child Psychologist", "I see dead people"], s: "The Sixth Sense" },
  { y: 1999, h: ["Starring Liam Neeson", "Prequel", "Podrace", "Double Lightsaber", "Anakin"], s: "Star Wars: The Phantom Menace" },
  { y: 1999, h: ["Starring Tom Hanks", "Death Row", "Miracle", "Gentle Giant", "Mr. Jingles"], s: "The Green Mile" },

  // 2000s
  { y: 2000, h: ["Starring Russell Crowe", "Arena", "Roman", "Vengeance", "Are you not entertained?"], s: "Gladiator" },
  { y: 2000, h: ["Starring Tom Hanks", "Island", "Survival", "Volleyball", "Wilson!"], s: "Cast Away" },
  { y: 2000, h: ["Starring Hugh Jackman", "Mutant", "Claws", "School", "Magneto"], s: "X-Men" },
  { y: 2000, h: ["Starring Ben Stiller", "In-Laws", "Awkward", "The Cat", "Circle of trust"], s: "Meet the Parents" },
  { y: 2000, h: ["Starring Guy Pearce", "Amnesia", "Backwards", "Tattoos", "Polaroids"], s: "Memento" },
  { y: 2000, h: ["Starring Denzel Washington", "Football", "Integration", "Virginia", "Leave no doubt"], s: "Remember the Titans" },
  { y: 2001, h: ["Starring Daniel Radcliffe", "Wizard", "Magic", "School", "Boy Who Lived"], s: "Harry Potter and the Sorcerer's Stone" },
  { y: 2001, h: ["Starring Billy Crystal", "Door", "Scare", "Scream", "Kitty"], s: "Monsters, Inc." },
  { y: 2001, h: ["Starring George Clooney", "Casino", "Heist", "Vegas", "Team"], s: "Ocean's Eleven" },
  { y: 2001, h: ["Starring Mike Myers", "Ogre", "Swamp", "Donkey", "Ogres are like onions"], s: "Shrek" },
  { y: 2001, h: ["Starring Elijah Wood", "The Ring", "Fantasy Quest", "The Shire", "You shall not pass"], s: "The Lord of the Rings: The Fellowship of the Ring" },
  { y: 2001, h: ["Starring Russell Crowe", "Mathematician", "Genius", "Hidden Codes", "Nash Equilibrium"], s: "A Beautiful Mind" },
  { y: 2001, h: ["Starring Nicole Kidman", "Paris", "Cabaret", "Bohemian", "Come What May"], s: "Moulin Rouge!" },
  { y: 2002, h: ["Starring Tobey Maguire", "Spider", "Hero", "New York", "Great Responsibility"], s: "Spider-Man" },
  { y: 2002, h: ["Starring Ray Romano", "Glacier", "Mammoth", "Sloth", "Acorn"], s: "Ice Age" },
  { y: 2002, h: ["Starring Nia Vardalos", "Wedding", "Greek", "Windex", "Family"], s: "My Big Fat Greek Wedding" },
  { y: 2002, h: ["Starring Elijah Wood", "The Ring", "Epic Battle", "Gollum", "My precious"], s: "The Lord of the Rings: The Two Towers" },
  { y: 2002, h: ["Starring Renée Zellweger", "Jazz Age", "Musical", "Cell Block", "Razzle Dazzle"], s: "Chicago" },
  { y: 2002, h: ["Starring Eminem", "Rap Battle", "Detroit", "Trailer Park", "Mom's spaghetti"], s: "8 Mile" },
  { y: 2002, h: ["Starring Leonardo DiCaprio", "Con Man", "Fraud", "FBI Chase", "Fake Pilot"], s: "Catch Me If You Can" },
  { y: 2003, h: ["Starring Johnny Depp", "Pirate", "Cursed", "Ship", "Jack Sparrow"], s: "Pirates of the Caribbean" },
  { y: 2003, h: ["Starring Albert Brooks", "Fish", "Ocean", "Memory", "Just keep swimming"], s: "Finding Nemo" },
  { y: 2003, h: ["Starring Will Ferrell", "North Pole", "New York", "Santa", "Cotton Headed Ninny Muggins"], s: "Elf" },
  { y: 2003, h: ["Starring Elijah Wood", "The Ring", "Finale", "Mount Doom", "For Frodo"], s: "The Lord of the Rings: The Return of the King" },
  { y: 2003, h: ["Starring Uma Thurman", "Revenge", "Samurai Sword", "Yellow Jumpsuit", "Wiggle your big toe"], s: "Kill Bill: Vol. 1" },
  { y: 2003, h: ["Starring Jack Black", "Substitute Teacher", "Rock Band", "Kids", "Stick it to the man"], s: "School of Rock" },
  { y: 2003, h: ["Starring Hugh Jackman", "Mutants", "Team-Up", "Nightcrawler", "Weapon X"], s: "X2: X-Men United" },
  { y: 2004, h: ["Starring Lindsay Lohan", "High School", "Plastic", "Burn Book", "Fetch"], s: "Mean Girls" },
  { y: 2004, h: ["Starring Mike Myers", "Ogre", "Donkey", "Potion", "Far Far Away"], s: "Shrek 2" },
  { y: 2004, h: ["Starring Ryan Gosling", "Romance", "Rain", "Letter", "It wasn't over"], s: "The Notebook" },
  { y: 2004, h: ["Starring Craig T. Nelson", "Superheroes", "Family", "Secret Identity", "No capes!"], s: "The Incredibles" },
  { y: 2004, h: ["Starring Jon Heder", "Awkward", "Deadpan", "Dance Routine", "Vote for Pedro"], s: "Napoleon Dynamite" },
  { y: 2004, h: ["Starring Tobey Maguire", "Hero", "Runaway Train", "Mechanical Arms", "Doc Ock"], s: "Spider-Man 2" },
  { y: 2004, h: ["Starring Matt Damon", "Amnesiac Spy", "Chase", "Moscow", "CIA"], s: "The Bourne Supremacy" },
  { y: 2005, h: ["Starring Ben Stiller", "Zoo", "Island", "Animals", "Move it Move it"], s: "Madagascar" },
  { y: 2005, h: ["Starring Owen Wilson", "Party", "Rules", "Wedding", "Lock it up"], s: "Wedding Crashers" },
  { y: 2005, h: ["Starring Christian Bale", "Origin Story", "Fear", "Bats", "Why do we fall?"], s: "Batman Begins" },
  { y: 2005, h: ["Starring Naomi Watts", "Giant Ape", "Skull Island", "Empire State Building", "Beauty killed the Beast"], s: "King Kong" },
  { y: 2005, h: ["Starring Johnny Depp", "Chocolate", "Golden Ticket", "Oompa Loompas", "The Factory"], s: "Charlie and the Chocolate Factory" },
  { y: 2005, h: ["Starring Tom Cruise", "Aliens", "Tripods", "Invasion", "The Basement"], s: "War of the Worlds" },
  { y: 2006, h: ["Starring Owen Wilson", "Race", "Car", "Route 66", "Ka-chow"], s: "Cars" },
  { y: 2006, h: ["Starring Ben Stiller", "Museum", "Night", "Exhibit", "Tablet"], s: "Night at the Museum" },
  { y: 2006, h: ["Starring Meryl Streep", "Fashion", "Magazine", "Assistant", "That's all"], s: "The Devil Wears Prada" },
  { y: 2006, h: ["Starring Leonardo DiCaprio", "Mob", "Undercover", "Boston", "The Rat"], s: "The Departed" },
  { y: 2006, h: ["Starring Daniel Craig", "Spy", "High-Stakes Poker", "Tuxedo", "Bond, James Bond"], s: "Casino Royale" },
  { y: 2006, h: ["Starring Abigail Breslin", "Road Trip", "Pageant", "VW Bus", "Dysfunctional Family"], s: "Little Miss Sunshine" },
  { y: 2007, h: ["Starring Patton Oswalt", "Rat", "Chef", "Paris", "Cooking"], s: "Ratatouille" },
  { y: 2007, h: ["Starring Jonah Hill", "Party", "Alcohol", "Fake ID", "McLovin"], s: "Superbad" },
  { y: 2007, h: ["Starring Javier Bardem", "Hitman", "Drug Money", "Coin Toss", "Call it, friendo"], s: "No Country for Old Men" },
  { y: 2007, h: ["Starring Shia LaBeouf", "Robots", "Alien Cars", "Autobots", "More than meets the eye"], s: "Transformers" },
  { y: 2007, h: ["Starring Elliot Page", "Teen Pregnancy", "Quirky", "Adoption", "Hamburger Phone"], s: "Juno" },
  { y: 2007, h: ["Starring Gerard Butler", "Spartans", "Battle", "Sepia", "This is Sparta!"], s: "300" },
  { y: 2008, h: ["Starring Robert Downey Jr.", "Suit", "Hero", "Cave", "I am Iron Man"], s: "Iron Man" },
  { y: 2008, h: ["Starring Jack Black", "Panda", "Kung Fu", "Dragon Warrior", "Noodles"], s: "Kung Fu Panda" },
  { y: 2008, h: ["Starring Kristen Stewart", "Vampire", "Romance", "Forest", "Sparkle"], s: "Twilight" },
  { y: 2008, h: ["Starring Christian Bale", "The Joker", "Gotham", "Chaos", "Why so serious?"], s: "The Dark Knight" },
  { y: 2008, h: ["Starring Ben Burtt", "Robot", "Trash Planet", "Space", "Eve"], s: "WALL-E" },
  { y: 2008, h: ["Starring Dev Patel", "Game Show", "Mumbai", "Slums", "It is written"], s: "Slumdog Millionaire" },
  { y: 2008, h: ["Starring Ben Stiller", "Actors", "War Movie", "Jungle", "Never go full method"], s: "Tropic Thunder" },
  { y: 2009, h: ["Starring Sam Worthington", "Blue", "Alien", "3D", "Pandora"], s: "Avatar" },
  { y: 2009, h: ["Starring Ed Asner", "Balloons", "House", "Flying", "Squirrel"], s: "Up" },
  { y: 2009, h: ["Starring Sandra Bullock", "Football", "Adoption", "Protective", "Coach"], s: "The Blind Side" },
  { y: 2009, h: ["Starring Bradley Cooper", "Bachelor Party", "Las Vegas", "Missing Groom", "Tiger in the Bathroom"], s: "The Hangover" },
  { y: 2009, h: ["Starring Brad Pitt", "WWII", "Nazis", "Cinema", "That's a Bingo!"], s: "Inglourious Basterds" },
  { y: 2009, h: ["Starring Chris Pine", "Space", "Reboot", "The Enterprise", "Live long and prosper"], s: "Star Trek" },

  // 2010s
  { y: 2010, h: ["Starring Leonardo DiCaprio", "Dream", "Mind", "Spinning Top", "Layers"], s: "Inception" },
  { y: 2010, h: ["Starring Steve Carell", "Villain", "Minions", "Moon", "Banana"], s: "Despicable Me" },
  { y: 2010, h: ["Starring Jay Baruchel", "Dragon", "Viking", "Flying", "Toothless"], s: "How to Train Your Dragon" },
  { y: 2010, h: ["Starring Tom Hanks", "Toys", "Daycare", "Incinerator", "So long, partner"], s: "Toy Story 3" },
  { y: 2010, h: ["Starring Jesse Eisenberg", "Facebook", "Harvard", "Lawsuit", "A million dollars isn't cool"], s: "The Social Network" },
  { y: 2011, h: ["Starring Chris Hemsworth", "Hammer", "God", "Exile", "Asgard"], s: "Thor" },
  { y: 2011, h: ["Starring Kristen Wiig", "Wedding", "Funny", "Food Poisoning", "Plane"], s: "Bridesmaids" },
  { y: 2011, h: ["Starring Andy Serkis", "Ape", "Smart", "Virus", "Caesar"], s: "Rise of the Planet of the Apes" },
  { y: 2011, h: ["Starring Daniel Radcliffe", "Wizard", "Finale", "Horcruxes", "Not my daughter, you witch!"], s: "Harry Potter and the Deathly Hallows – Part 2" },
  { y: 2011, h: ["Starring Ryan Gosling", "Getaway Driver", "Neon", "Scorpion Jacket", "The Elevator"], s: "Drive" },
  { y: 2012, h: ["Starring Robert Downey Jr.", "Team", "New York", "Aliens", "Assemble"], s: "The Avengers" },
  { y: 2012, h: ["Starring Jennifer Lawrence", "Archery", "Survival", "District", "Volunteer"], s: "The Hunger Games" },
  { y: 2012, h: ["Starring John C. Reilly", "Video Game", "Bad Guy", "Candy", "Glitch"], s: "Wreck-It Ralph" },
  { y: 2012, h: ["Starring Christian Bale", "Bane", "Gotham", "The Pit", "The fire rises"], s: "The Dark Knight Rises" },
  { y: 2012, h: ["Starring Jamie Foxx", "Bounty Hunter", "Revenge", "Antebellum South", "The D is silent"], s: "Django Unchained" },
  { y: 2013, h: ["Starring Idina Menzel", "Ice", "Princess", "Sister", "Let It Go"], s: "Frozen" },
  { y: 2013, h: ["Starring Brad Pitt", "Zombie", "Global", "Virus", "Fast Zombies"], s: "World War Z" },
  { y: 2013, h: ["Starring Sandra Bullock", "Space", "Debris", "Astronaut", "Survival"], s: "Gravity" },
  { y: 2013, h: ["Starring Leonardo DiCaprio", "Stockbroker", "Excess", "Fraud", "Sell me this pen"], s: "The Wolf of Wall Street" },
  { y: 2013, h: ["Starring Henry Cavill", "Superman", "Krypton", "The Cape", "The S stands for hope"], s: "Man of Steel" },
  { y: 2014, h: ["Starring Chris Pratt", "Space", "Raccoon", "Music", "Star Lord"], s: "Guardians of the Galaxy" },
  { y: 2014, h: ["Starring Ryan Potter", "Robot", "Nurse", "Microbots", "Hairy Baby"], s: "Big Hero 6" },
  { y: 2014, h: ["Starring Ben Affleck", "Missing", "Wife", "Media", "Diary"], s: "Gone Girl" },
  { y: 2014, h: ["Starring Matthew McConaughey", "Space", "Wormhole", "Time Dilation", "Do not go gentle"], s: "Interstellar" },
  { y: 2014, h: ["Starring Chris Pratt", "Bricks", "Prophecy", "Master Builders", "Everything is Awesome"], s: "The Lego Movie" },
  { y: 2014, h: ["Starring Miles Teller", "Drummer", "Obsessive", "Conservatory", "Not quite my tempo"], s: "Whiplash" },
  { y: 2015, h: ["Starring Daisy Ridley", "Force", "Desert", "Lightsaber", "Awakens"], s: "The Force Awakens" },
  { y: 2015, h: ["Starring Amy Poehler", "Emotions", "Brain", "Memory", "Joy"], s: "Inside Out" },
  { y: 2015, h: ["Starring Chris Pratt", "Dinosaur", "Park", "Hybrid", "Raptor Squad"], s: "Jurassic World" },
  { y: 2015, h: ["Starring Tom Hardy", "Wasteland", "Car Chase", "War Rig", "Witness me"], s: "Mad Max: Fury Road" },
  { y: 2015, h: ["Starring Matt Damon", "Mars", "Stranded", "Potatoes", "Science the heck out of this"], s: "The Martian" },
  { y: 2015, h: ["Starring Michael B. Jordan", "Boxing", "Legacy", "Philadelphia", "Apollo's Son"], s: "Creed" },
  { y: 2016, h: ["Starring Ryan Reynolds", "Mask", "Funny", "Cancer", "Chimichanga"], s: "Deadpool" },
  { y: 2016, h: ["Starring Ginnifer Goodwin", "Animals", "City", "Bunny", "Fox"], s: "Zootopia" },
  { y: 2016, h: ["Starring Taraji P. Henson", "NASA", "Math", "Space", "Computer"], s: "Hidden Figures" },
  { y: 2016, h: ["Starring Emma Stone", "Musical", "Jazz", "Los Angeles", "City of Stars"], s: "La La Land" },
  { y: 2016, h: ["Starring Felicity Jones", "Death Star Plans", "Rebels", "Sacrifice", "I am one with the Force"], s: "Rogue One: A Star Wars Story" },
  { y: 2016, h: ["Starring Auli'i Cravalho", "Ocean", "Island", "Demigod", "How Far I'll Go"], s: "Moana" },
  { y: 2017, h: ["Starring Gal Gadot", "Hero", "Amazon", "War", "Lasso"], s: "Wonder Woman" },
  { y: 2017, h: ["Starring Anthony Gonzalez", "Skeleton", "Music", "Guitar", "Remember Me"], s: "Coco" },
  { y: 2017, h: ["Starring Bill Skarsgård", "Clown", "Balloon", "Sewer", "Float"], s: "It" },
  { y: 2017, h: ["Starring Daniel Kaluuya", "Horror", "Hypnosis", "The Sunken Place", "Teacup"], s: "Get Out" },
  { y: 2017, h: ["Starring Chris Hemsworth", "Thunder", "Gladiator Arena", "Colorful", "He's a friend from work"], s: "Thor: Ragnarok" },
  { y: 2017, h: ["Starring Fionn Whitehead", "WWII", "Evacuation", "The Beach", "One Week, One Day, One Hour"], s: "Dunkirk" },
  { y: 2018, h: ["Starring Chadwick Boseman", "King", "Africa", "Tech", "Wakanda Forever"], s: "Black Panther" },
  { y: 2018, h: ["Starring Lady Gaga", "Singer", "Fame", "Music", "Shallow"], s: "A Star Is Born" },
  { y: 2018, h: ["Starring Constance Wu", "Wealth", "Singapore", "Wedding", "Mahjong"], s: "Crazy Rich Asians" },
  { y: 2018, h: ["Starring Robert Downey Jr.", "Thanos", "The Snap", "Infinity Gauntlet", "I don't feel so good"], s: "Avengers: Infinity War" },
  { y: 2018, h: ["Starring Emily Blunt", "Silence", "Monsters", "Farmhouse", "The Nail"], s: "A Quiet Place" },
  { y: 2018, h: ["Starring Shameik Moore", "Animation", "Multiverse", "Brooklyn", "Leap of faith"], s: "Spider-Man: Into the Spider-Verse" },
  { y: 2019, h: ["Starring Joaquin Phoenix", "Clown", "Society", "Stairs", "Laugh"], s: "Joker" },
  { y: 2019, h: ["Starring Daniel Craig", "Detective", "Murder", "Donut", "Inheritance"], s: "Knives Out" },
  { y: 2019, h: ["Starring George MacKay", "War", "Message", "One Shot", "Run"], s: "1917" },
  { y: 2019, h: ["Starring Robert Downey Jr.", "Time Heist", "The Snap", "Assemble", "I am Iron Man"], s: "Avengers: Endgame" },
  { y: 2019, h: ["Starring Song Kang-ho", "Class Divide", "Twist", "The Basement", "Jessica, only child"], s: "Parasite" },
  { y: 2019, h: ["Starring Leonardo DiCaprio", "1969", "Stuntman", "Hollywood", "Flamethrower"], s: "Once Upon a Time in Hollywood" },

  // 2020s
  { y: 2020, h: ["Starring Jamie Foxx", "Jazz", "Afterlife", "Piano", "Spark"], s: "Soul" },
  { y: 2020, h: ["Starring John David Washington", "Time Inversion", "Spy", "Turnstile", "Don't try to understand it"], s: "Tenet" },
  { y: 2020, h: ["Starring Gal Gadot", "Superhero", "The '80s", "A Wish", "Cheetah"], s: "Wonder Woman 1984" },
  { y: 2020, h: ["Starring Eddie Redmayne", "Courtroom", "Protest", "1968", "Conspiracy"], s: "The Trial of the Chicago 7" },
  { y: 2021, h: ["Starring Stephanie Beatriz", "Magic", "House", "Gift", "Bruno"], s: "Encanto" },
  { y: 2021, h: ["Starring Ryan Reynolds", "Video Game", "NPC", "Glasses", "Blue Shirt"], s: "Free Guy" },
  { y: 2021, h: ["Starring Emily Blunt", "Silence", "Monsters", "The Radio", "The Baby"], s: "A Quiet Place Part II" },
  { y: 2021, h: ["Starring Tom Holland", "Multiverse", "Villains Return", "Broken Spell", "Great responsibility"], s: "Spider-Man: No Way Home" },
  { y: 2021, h: ["Starring Timothée Chalamet", "Desert Planet", "The Spice", "Sandworm", "Fear is the mind-killer"], s: "Dune" },
  { y: 2021, h: ["Starring Daniel Craig", "Spy", "Farewell", "Poison Garden", "We have all the time in the world"], s: "No Time to Die" },
  { y: 2022, h: ["Starring Tom Cruise", "Plane", "Speed", "Teacher", "Maverick"], s: "Top Gun: Maverick" },
  { y: 2022, h: ["Starring Robert Pattinson", "Detective", "Dark", "Riddle", "Vengeance"], s: "The Batman" },
  { y: 2022, h: ["Starring Daniel Craig", "Island", "Mystery", "Billionaire", "Onion"], s: "Glass Onion: A Knives Out Mystery" },
  { y: 2022, h: ["Starring Michelle Yeoh", "Multiverse", "Laundromat", "Everything Bagel", "Hot Dog Fingers"], s: "Everything Everywhere All at Once" },
  { y: 2022, h: ["Starring Sam Worthington", "Pandora", "Oceans", "Na'vi", "The Reef"], s: "Avatar: The Way of Water" },
  { y: 2022, h: ["Starring Daniel Kaluuya", "UFO", "Horse Ranch", "The Sky", "Bad Miracle"], s: "Nope" },
  { y: 2023, h: ["Starring Margot Robbie", "Doll", "Pink", "Real World", "Hi Barbie"], s: "Barbie" },
  { y: 2023, h: ["Starring Chris Pratt", "Plumber", "Mushroom", "Princess", "Kart"], s: "The Super Mario Bros. Movie" },
  { y: 2023, h: ["Starring Chris Pratt", "Raccoon", "Finale", "Music", "Dog Days"], s: "Guardians of the Galaxy Vol. 3" },
  { y: 2023, h: ["Starring Cillian Murphy", "Bomb", "Science", "War", "Destroyer of Worlds"], s: "Oppenheimer" },
  { y: 2023, h: ["Starring Shameik Moore", "Animation", "Multiverse", "The Spot", "It's a canon event"], s: "Spider-Man: Across the Spider-Verse" },
  { y: 2023, h: ["Starring Keanu Reeves", "Assassin", "Revenge", "Sacré-Cœur Steps", "The High Table"], s: "John Wick: Chapter 4" },
  { y: 2024, h: ["Starring Amy Poehler", "Emotions", "Puberty", "Anxiety Arrives", "Riley"], s: "Inside Out 2" },
  { y: 2024, h: ["Starring Ryan Reynolds", "Merc with a Mouth", "Multiverse", "Adamantium Claws", "Marvel Jesus"], s: "Deadpool & Wolverine" },
  { y: 2024, h: ["Starring Timothée Chalamet", "Desert Planet", "Sandworm Riding", "Messiah", "Lisan al-Gaib"], s: "Dune: Part Two" },
  { y: 2024, h: ["Starring Cynthia Erivo", "Land of Oz", "Musical", "Green Witch", "Defying Gravity"], s: "Wicked" },
  { y: 2024, h: ["Starring Auli'i Cravalho", "Ocean", "Voyage", "Wayfinding", "Beyond the Reef"], s: "Moana 2" },
  { y: 2024, h: ["Starring Paul Mescal", "Ancient Rome", "The Arena", "Revenge", "The Colosseum"], s: "Gladiator II" },
  { y: 2024, h: ["Starring Glen Powell", "Tornadoes", "Storm Chasers", "Oklahoma", "Ride the Storm"], s: "Twisters" },
  { y: 2024, h: ["Starring Michael Keaton", "Ghost", "Sequel", "The Afterlife", "Say it three times"], s: "Beetlejuice Beetlejuice" },
  { y: 2025, h: ["Starring Jack Black", "Blocky World", "Video Game", "The Overworld", "Chicken Jockey!"], s: "A Minecraft Movie" },
  { y: 2025, h: ["Starring Anthony Mackie", "The Shield", "New Cap", "Red Hulk", "Wings"], s: "Captain America: Brave New World" },
  { y: 2025, h: ["Starring Florence Pugh", "Antiheroes", "Reluctant Team", "The Void", "Marvel Misfits"], s: "Thunderbolts" },
  { y: 2025, h: ["Starring Maia Kealoha", "Alien Experiment", "Hawaii", "Live-Action", "Ohana means family"], s: "Lilo & Stitch" },
  { y: 2025, h: ["Starring Tom Cruise", "Super Spy", "Death-Defying Stunts", "The Entity", "Your mission, should you choose to accept it"], s: "Mission: Impossible – The Final Reckoning" },
  { y: 2025, h: ["Starring Brad Pitt", "Motorsport", "Comeback", "The Grid", "Formula 1"], s: "F1" },
  { y: 2025, h: ["Starring David Corenswet", "The Cape", "Metropolis", "Krypto the Dog", "Truth and Justice"], s: "Superman" },
  { y: 2025, h: ["Starring Scarlett Johansson", "Dinosaurs", "Tropical Island", "DNA Expedition", "Life finds a way, again"], s: "Jurassic World Rebirth" },
  { y: 2025, h: ["Starring Sam Worthington", "Pandora", "Fire", "New Na'vi Clan", "The Ash People"], s: "Avatar: Fire and Ash" },
  { y: 2026, h: ["Starring Ryan Gosling", "Deep Space", "Amnesia", "Astrophage", "Rocky"], s: "Project Hail Mary" },
  { y: 2026, h: ["Starring Chris Pratt", "Mushroom Kingdom", "Outer Space", "Power Stars", "Wahoo!"], s: "The Super Mario Galaxy Movie" },
  { y: 2026, h: ["Starring Tom Hanks", "Toys", "Reunion", "Technology", "To infinity and beyond"], s: "Toy Story 5" },
  { y: 2026, h: ["Starring Pedro Pascal", "Bounty Hunter", "Grogu", "Beskar Armor", "This is the Way"], s: "The Mandalorian and Grogu" }
];

// --- HELPER FUNCTIONS ---
const seededRandom = (seed) => {
    let value = seed;
    return function() {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    }
}

const getPacificDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

// Returns the calendar day before the given YYYY-MM-DD string (Pacific-safe).
const getPreviousDate = (dateStr) => {
    const d = new Date(`${dateStr}T12:00:00`);
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-CA');
};

const getDailyIndex = () => {
    const startDate = new Date('2024-01-01T00:00:00-08:00');
    const now = new Date();
    const diffTime = now - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const indices = Array.from({ length: GAME_DATA.length }, (_, i) => i);
    const rng = seededRandom(12345);
    
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    const safeIndex = Math.abs(diffDays) % indices.length;
    return indices[safeIndex];
};

const DEFAULT_STATS = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0, lastWonDate: null };

const loadStats = () => {
    try {
        const raw = JSON.parse(localStorage.getItem('mw_stats'));
        return raw ? { ...DEFAULT_STATS, ...raw } : { ...DEFAULT_STATS };
    } catch {
        return { ...DEFAULT_STATS };
    }
};

// --- COMPONENTS ---

const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2 font-display">
           <HelpCircle className="text-yellow-500" /> How to Play
        </h2>
        
        <div className="space-y-4 text-sm text-gray-300">
           <div className="flex gap-3">
              <div className="font-bold text-white bg-gray-800 h-6 w-6 flex items-center justify-center rounded-full shrink-0">1</div>
              <p>Guess the release year of the daily movie based on the hints.</p>
           </div>
           <div className="flex gap-3">
              <div className="font-bold text-white bg-gray-800 h-6 w-6 flex items-center justify-center rounded-full shrink-0">2</div>
              <p>After each guess, you'll see if the actual year is <span className="text-blue-400 font-bold">Higher</span> or <span className="text-red-400 font-bold">Lower</span>.</p>
           </div>
           <div className="flex gap-3">
              <div className="font-bold text-white bg-gray-800 h-6 w-6 flex items-center justify-center rounded-full shrink-0">3</div>
              <p>Each incorrect guess unlocks a new hint (Star, Keyword, Quote, etc).</p>
           </div>
           <div className="flex gap-3">
              <div className="font-bold text-white bg-gray-800 h-6 w-6 flex items-center justify-center rounded-full shrink-0">4</div>
              <p>Solve it in {MAX_GUESSES} tries to keep your <span className="text-amber-400 font-bold">streak</span> alive!</p>
           </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors"
        >
          Let's Play
        </button>
      </div>
    </div>
  );
};

const Confetti = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 5 + 2,
        color: ['#facc15', '#ef4444', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 4
    }));

    let animationId;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.vy;
            p.x += p.vx;
            if (p.y > canvas.height) p.y = -10;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        animationId = requestAnimationFrame(animate);
    };
    animate();
    const timer = setTimeout(() => cancelAnimationFrame(animationId), 5000);
    return () => { cancelAnimationFrame(animationId); clearTimeout(timer); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />;
};

const Wheel = ({ min, max, value, onChange, label }) => {
  const containerRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  const ITEM_HEIGHT = 64; 

  const baseItems = useMemo(() => {
    let arr = [];
    for (let i = min; i <= max; i++) arr.push(i);
    return arr;
  }, [min, max]);

  const REPEAT_COUNT = baseItems.length > 50 ? 3 : 40;
  
  const displayItems = useMemo(() => {
    let arr = [];
    for(let i=0; i<REPEAT_COUNT; i++) arr = [...arr, ...baseItems];
    return arr;
  }, [baseItems, REPEAT_COUNT]);

  const totalHeight = displayItems.length * ITEM_HEIGHT;
  const singleSetHeight = baseItems.length * ITEM_HEIGHT;

  const handleScroll = (e) => {
    isScrolling.current = true;
    const container = e.target;
    let scrollTop = container.scrollTop;

    if (scrollTop < singleSetHeight / 2) {
        scrollTop += singleSetHeight;
        container.scrollTop = scrollTop;
    } 
    else if (scrollTop > totalHeight - (singleSetHeight * 1.5)) {
        scrollTop -= singleSetHeight;
        container.scrollTop = scrollTop;
    }

    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const safeIndex = index % baseItems.length; 
    const newValue = baseItems[safeIndex];
    
    if (newValue !== undefined && newValue !== value) {
        onChange(newValue);
    }
    
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => { isScrolling.current = false; }, 50);
  };

  useEffect(() => {
    if (containerRef.current && !isScrolling.current) {
        const index = baseItems.indexOf(value);
        if (index !== -1) {
            const middleSetIndex = Math.floor(REPEAT_COUNT / 2);
            const targetScroll = (middleSetIndex * singleSetHeight) + (index * ITEM_HEIGHT);
            
            const currentScroll = containerRef.current.scrollTop;
            if (Math.abs(currentScroll - targetScroll) > 1000) {
                 containerRef.current.scrollTop = targetScroll;
            } else {
                 containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
        }
    }
  }, [value, baseItems, singleSetHeight, REPEAT_COUNT]);

  const goUp = () => {
      const next = value - 1 < min ? max : value - 1;
      onChange(next);
  };

  const goDown = () => {
      const next = value + 1 > max ? min : value + 1;
      onChange(next);
  };

  return (
    <div className="flex flex-col items-center gap-2">
       <button onClick={goUp} className="p-2 text-gray-500 hover:text-yellow-400 transition-colors bg-gray-800 rounded-full border border-gray-700 active:bg-gray-700">
          <ChevronUp size={24} />
       </button>
       
       <div className="relative group">
           <div className="text-center text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-widest">{label}</div>
           <div className="relative h-[240px] w-28 sm:w-32 bg-gray-900 rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 z-10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 border-y-2 border-yellow-500/50 bg-white/5 z-0 pointer-events-none"></div>
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide py-[88px]"
            >
                {displayItems.map((num, i) => (
                    <div key={i} className={`h-16 flex items-center justify-center snap-center text-4xl font-black font-mono transition-all duration-300 ${num === value ? 'text-yellow-400 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-700 blur-[1px]'}`}>
                        {num < 10 && max > 9 ? `0${num}` : num}
                    </div>
                ))}
            </div>
          </div>
       </div>

       <button onClick={goDown} className="p-2 text-gray-500 hover:text-yellow-400 transition-colors bg-gray-800 rounded-full border border-gray-700 active:bg-gray-700">
          <ChevronDown size={24} />
       </button>
    </div>
  );
};

const HintCard = ({ hint, index, revealed }) => {
  // HIDDEN UNTIL REVEALED:
  // If this hint hasn't been unlocked yet, we return null so it doesn't take up space.
  if (!revealed) return null;

  return (
    <div className="w-full bg-gray-800/80 rounded-xl border-l-4 border-yellow-500 p-4 shadow-lg flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1 opacity-70">
            {["The Star", "The Keyword", "The Vibe", "The Detail", "The Quote"][index] || "Hint"}
        </span>
        <span className="text-white text-lg font-medium leading-snug font-sans">{hint}</span>
    </div>
  );
};

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState('');
  
    useEffect(() => {
      const timer = setInterval(() => {
          const now = new Date();
          const ptNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
          const ptMidnight = new Date(ptNow);
          ptMidnight.setHours(24, 0, 0, 0);
          
          const diff = ptMidnight - ptNow;
          
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / (1000 * 60)) % 60);
          const s = Math.floor((diff / 1000) % 60);
          
          setTimeLeft(`${h}h ${m}m ${s}s`);
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  
    return (
        <div className="flex flex-col items-center">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">Next Movie In</span>
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-xl bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 shadow-inner">
              <Clock size={16} className="text-yellow-500" />
              <span>{timeLeft || "00:00:00"}</span>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, highlight }) => (
    <div className="flex flex-col items-center justify-center bg-gray-900/60 rounded-xl py-2.5 border border-gray-700/50">
        <span className={`text-2xl font-black font-mono leading-none ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</span>
        <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-1">{label}</span>
    </div>
);

// --- MAIN COMPONENT ---
export default function App() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [century, setCentury] = useState(19);
  const [yearLastTwo, setYearLastTwo] = useState(90);
  const [guesses, setGuesses] = useState([]);
  const [revealedCount, setRevealedCount] = useState(1);
  const [gameStatus, setGameStatus] = useState('loading'); 
  const [feedback, setFeedback] = useState(null); 
  const [todayStr, setTodayStr] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [stats, setStats] = useState(DEFAULT_STATS);
  
  // New input mode states
  const [isInputMode, setIsInputMode] = useState(false);
  const [manualYear, setManualYear] = useState("");

  useEffect(() => {
    loadDailyGame();
    setStats(loadStats());
    // Check if user has seen instructions
    const hasSeen = localStorage.getItem('mw_seen_instructions');
    if (!hasSeen) {
      setShowInstructions(true);
    }
  }, []);

  const closeInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('mw_seen_instructions', 'true');
  };

  const loadDailyGame = () => {
    const pacificDate = getPacificDate();
    setTodayStr(pacificDate);
    
    const savedState = JSON.parse(localStorage.getItem(`mw_state_${pacificDate}`));
    const dailyIdx = getDailyIndex();
    const levelData = GAME_DATA[dailyIdx];
    
    setCurrentLevel(levelData);

    if (savedState) {
        setGuesses(savedState.guesses);
        setRevealedCount(savedState.revealedCount);
        setGameStatus(savedState.gameStatus);
        setCentury(savedState.century || 19);
        setYearLastTwo(savedState.yearLastTwo || 90);
        
        if (savedState.guesses.length > 0 && savedState.gameStatus !== 'won' && savedState.gameStatus !== 'lost') {
             const last = savedState.guesses[savedState.guesses.length - 1];
             setFeedback({ type: last < levelData.y ? 'higher' : 'lower', val: last });
        }
    } else {
        setGameStatus('playing');
        setGuesses([]);
        setRevealedCount(1);
        setFeedback(null);
        setCentury(19);
        setYearLastTwo(90);
    }
  };

  useEffect(() => {
    if (todayStr && gameStatus !== 'loading') {
        const state = { guesses, revealedCount, gameStatus, century, yearLastTwo };
        localStorage.setItem(`mw_state_${todayStr}`, JSON.stringify(state));
    }
  }, [guesses, revealedCount, gameStatus, century, yearLastTwo, todayStr]);

  // Sync manual input with current wheel values when switching to input mode
  useEffect(() => {
    if (isInputMode) {
        setManualYear(formatYear(century, yearLastTwo));
    }
  }, [isInputMode, century, yearLastTwo]);

  // Record win/loss into the persistent streak stats exactly once (on the live transition).
  const recordResult = (won) => {
    const next = { ...loadStats() };
    next.played += 1;
    if (won) {
        next.wins += 1;
        next.currentStreak = next.lastWonDate === getPreviousDate(todayStr) ? next.currentStreak + 1 : 1;
        next.lastWonDate = todayStr;
        if (next.currentStreak > next.maxStreak) next.maxStreak = next.currentStreak;
    } else {
        next.currentStreak = 0;
    }
    localStorage.setItem('mw_stats', JSON.stringify(next));
    setStats(next);
  };

  const handleGuess = () => {
    if (gameStatus !== 'playing') return;
    const guess = (century * 100) + yearLastTwo;
    const target = currentLevel.y;
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);

    if (guess === target) {
      setGameStatus('won');
      setFeedback({ type: 'correct', val: guess });
      recordResult(true);
    } else {
      setFeedback({ type: guess < target ? 'higher' : 'lower', val: guess });
      
      if (revealedCount < MAX_GUESSES) {
          setRevealedCount(c => c + 1);
      }
      
      if (newGuesses.length >= MAX_GUESSES) {
          setGameStatus('lost');
          recordResult(false);
      }
    }
  };

  const generateShareText = () => {
    const isWon = gameStatus === 'won';
    const guessCount = isWon ? guesses.length : "X";
    const emojiGrid = guesses.map(g => {
        if (g < currentLevel.y) return '⬆️';
        if (g > currentLevel.y) return '⬇️';
        return '🟩';
    }).join('');
    
    const streakLine = stats.currentStreak > 1 ? `\n🔥 ${stats.currentStreak} day streak!` : '';
    return `MovieWhen 🎬\nI ${isWon ? 'solved' : 'failed'} the daily movie in ${guessCount}/${MAX_GUESSES}!\n\n${emojiGrid}${streakLine}\n\nPlay at: ${CONFIG.gameUrl}`;
  };

  const handleCopy = () => {
    const shareText = generateShareText();
    const textArea = document.createElement("textarea");
    textArea.value = shareText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleTwitter = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(CONFIG.gameUrl)}`;
    window.open(url, '_blank');
  };

  const formatYear = (c, y) => `${c}${y < 10 ? '0'+y : y}`;

  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  if (gameStatus === 'loading' || !currentLevel) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading Cinema...</div>;

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-yellow-500/30 flex flex-col relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(250,204,21,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_80%,rgba(239,68,68,0.05),transparent_45%)]" />
      </div>

      {gameStatus === 'won' && <Confetti />}
      
      <InstructionsModal isOpen={showInstructions} onClose={closeInstructions} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-gray-950/70 backdrop-blur-xl">
        <div className="max-w-md mx-auto flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2 rounded-xl text-gray-900 shadow-lg shadow-amber-500/20">
                    <Clapperboard size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white leading-none font-display tracking-tight">
                        Movie<span className="text-yellow-400">When</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase mt-1">
                        Daily Challenge
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {stats.currentStreak > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1" title="Current streak">
                        <Flame size={14} />
                        <span className="text-xs font-bold font-mono">{stats.currentStreak}</span>
                    </div>
                )}
                <button onClick={() => setShowInstructions(true)} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                   <HelpCircle size={20} />
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-6">
        
        {/* Date */}
        <div className="flex items-center justify-center gap-2 -mb-2 text-gray-500">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-700" />
            <span className="text-[11px] font-mono tracking-widest uppercase">{todayStr}</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-700" />
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 h-1.5 w-full">
            {[1,2,3,4,5].map(i => (
                <div key={i} className={`flex-1 rounded-full transition-colors duration-500 ${i <= revealedCount ? 'bg-yellow-500' : 'bg-gray-800'}`} />
            ))}
        </div>

        {/* Hints */}
        <div className="space-y-3 min-h-[100px]">
            {currentLevel.h.map((hint, i) => (
                <HintCard key={i} hint={hint} index={i} revealed={i < revealedCount} />
            ))}
        </div>

        {/* Game Area */}
        <div className="mt-auto">
            {(gameStatus === 'won' || gameStatus === 'lost') ? (
                <div className={`bg-gradient-to-br ${gameStatus === 'won' ? 'from-green-900/40' : 'from-red-900/40'} to-gray-900 border ${gameStatus === 'won' ? 'border-green-500/30' : 'border-red-500/30'} rounded-2xl p-6 text-center animate-in zoom-in-95 duration-300`}>
                    <div className={`inline-flex p-3 ${gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'} rounded-full text-white mb-4 shadow-lg`}>
                        {gameStatus === 'won' ? <Trophy size={32} /> : <AlertCircle size={32} />}
                    </div>
                    
                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 ${gameStatus === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                        {gameStatus === 'won' ? 'Victory!' : 'Game Over'}
                    </h3>
                    
                    <h2 className={`text-5xl font-black mb-2 font-display ${gameStatus === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                        {currentLevel.y}
                    </h2>
                    <p className="text-xl text-white font-medium mb-6">{currentLevel.s}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        <StatBox label="Played" value={stats.played} />
                        <StatBox label="Win %" value={winPct} />
                        <StatBox label="Streak" value={stats.currentStreak} highlight />
                        <StatBox label="Best" value={stats.maxStreak} />
                    </div>

                    {/* Social Share & Countdown */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="mb-4">
                            <Countdown />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={handleTwitter}
                                className="flex flex-col items-center justify-center gap-1 py-3 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition-colors border border-gray-700"
                            >
                                <Twitter size={20} /> 
                                <span className="text-xs">Post</span>
                            </button>
                            <button 
                                onClick={handleFacebook}
                                className="flex flex-col items-center justify-center gap-1 py-3 bg-[#1877F2] hover:bg-[#1565D8] text-white font-bold rounded-xl transition-colors"
                            >
                                <Facebook size={20} /> 
                                <span className="text-xs">Share</span>
                            </button>
                            <button 
                                onClick={handleCopy}
                                className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
                            >
                                {showCopied ? <Trophy size={20} className="text-yellow-500" /> : <Copy size={20} />}
                                <span className="text-xs">{showCopied ? "Copied" : "Copy"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                    {/* Feedback Bubble */}
                    {feedback && (
                        <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 border-l-4 shadow-lg
                            ${feedback.type === 'higher' ? 'bg-blue-900/30 border-blue-500' : 'bg-red-900/30 border-red-500'}`}>
                            <div className={`p-2 rounded-full ${feedback.type === 'higher' ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
                                {feedback.type === 'higher' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-base text-white">
                                    Go {feedback.type === 'higher' ? 'HIGHER' : 'LOWER'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 relative">
                        {/* Toggle Button */}
                        <button 
                            onClick={() => setIsInputMode(!isInputMode)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 transition-colors z-20"
                            title={isInputMode ? "Switch to Scroll" : "Switch to Type"}
                        >
                            {isInputMode ? <MousePointer2 size={20} /> : <Keyboard size={20} />}
                        </button>

                        {isInputMode ? (
                            <div className="flex justify-center items-center h-[288px] mb-6">
                                <input 
                                    type="number"
                                    min="1900"
                                    max="2099"
                                    value={manualYear}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setManualYear(val);
                                        const intVal = parseInt(val);
                                        if (val.length === 4 && !isNaN(intVal)) {
                                             const c = Math.floor(intVal / 100);
                                             if (c >= 19 && c <= 20) {
                                                 setCentury(c);
                                                 setYearLastTwo(intVal % 100);
                                             }
                                        }
                                    }}
                                    placeholder="YYYY"
                                    className="bg-transparent text-6xl font-black text-center text-white border-b-4 border-yellow-500 focus:outline-none w-48 placeholder-gray-600 font-mono"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center gap-4 mb-6">
                                <Wheel min={19} max={20} value={century} onChange={setCentury} label="Century" />
                                <Wheel min={0} max={99} value={yearLastTwo} onChange={setYearLastTwo} label="Year" />
                            </div>
                        )}
                        
                        <button 
                            onClick={handleGuess}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black text-xl py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 font-display"
                        >
                            GUESS {formatYear(century, yearLastTwo)}
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* History */}
        {guesses.length > 0 && gameStatus !== 'won' && gameStatus !== 'lost' && (
            <div className="flex flex-wrap gap-2 justify-center pb-4">
                {guesses.map((g, idx) => (
                    <div key={idx} className={`px-3 py-1 rounded-full text-sm font-mono font-bold flex items-center gap-1
                        ${g < currentLevel.y ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-red-900/40 text-red-300 border border-red-800'}`}>
                        {g} {g < currentLevel.y ? '↑' : '↓'}
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full px-4 py-6 text-center">
        <p className="text-[11px] text-gray-600 font-mono tracking-wide">
            A new movie every day at midnight PT · {GAME_DATA.length} films
        </p>
      </footer>

      {/* Hide Scrollbar Style */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
