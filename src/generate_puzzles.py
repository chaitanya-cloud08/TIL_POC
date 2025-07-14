import json
import random
import os
import grapheme # <-- सबसे महत्वपूर्ण बदलाव: नई लाइब्रेरी इम्पोर्ट करें

# --- Word list can be the expanded one you already have ---
WORD_LIST = [
    ("भारत", "एक देश का नाम"), ("दिल्ली", "भारत की राजधानी"), ("मुंबई", "भारत का आर्थिक केंद्र"),
    ("कलम", "लिखने का साधन"), ("किताब", "पढ़ने की वस्तु"), ("कागज", "जिस पर लिखते हैं"),
    ("पानी", "जीवन के लिए ज़रूरी"), ("हवा", "साँस लेने के लिए ज़रूरी"), ("आगरा", "ताज महल का शहर"),
    ("गंगा", "भारत की पवित्र नदी"), ("नदी", "बहता हुआ पानी"), ("पहाड़", "ऊँची ज़मीन"),
    ("सागर", "विशाल जलराशि"), ("राजा", "राज्य का शासक"), ("रानी", "राजा की पत्नी"),
    ("घर", "रहने की जगह"), ("कमरा", "घर का एक हिस्सा"), ("आराम", "थकान मिटाना"),
    ("काम", "कार्य"), ("मेहनत", "परिश्रम"), ("सड़क", "गाड़ियाँ चलने का रास्ता"),
    ("गाड़ी", "यातायात का साधन"), ("रेल", "पटरी पर चलने वाली गाड़ी"), ("समय", "घड़ी बताती है"),
    ("दिन", "रात का उल्टा"), ("रात", "जब चाँद निकलता है"), ("सूरज", "दिन में रोशनी देता है"),
    ("तारा", "रात में चमकता है"), ("चाँद", "रात का राजा"), ("फल", "पेड़ से मिलता है, जैसे आम"),
    ("फूल", "पौधे का सुंदर भाग"), ("आम", "फलों का राजा"), ("सेब", "एक लाल फल"),
    ("कला", "आर्ट"), ("रंग", "होली में उपयोग होता है"), ("लाल", "एक रंग"),
    ("हरा", "पेड़ों का रंग"), ("पीला", "हल्दी का रंग"), ("नीला", "आसमान का रंग"),
    ("बात", "वार्तालाप"), ("नाम", "किसी व्यक्ति की पहचान"), ("प्यार", "प्रेम, स्नेह"),
    ("दोस्त", "मित्र"), ("माफ", "क्षमा करना"), ("साफ", "स्वच्छ"),
    ("सच", "झूठ का उल्टा"), ("खेल", "मनोरंजन की गतिविधि"), ("जीत", "हार का उल्टा"),
    ("हार", "पराजय"), ("पाँच", "एक संख्या"), ("सात", "एक संख्या"),
    ("भाषा", "बोलने का माध्यम"), ("हिंदी", "हमारी राजभाषा"), ("गीत", "जो गाया जाए"),
    ("गाना", "गीत गाना"), ("नाच", "नृत्य"), ("गाँव", "छोटा कस्बा"),
    ("शहर", "बड़ा नगर"), ("किसान", "खेती करने वाला"), ("मेला", "उत्सव का बाज़ार"),
    ("सेवा", "खिदमत"), ("माता", "माँ"), ("पिता", "पापा"), ("बेटा", "पुत्र"),
    ("बेटी", "पुत्री"), ("चाचा", "पिता का भाई"), ("मामा", "माँ का भाई"),
    ("नानी", "माँ की माँ"), ("दादी", "पिता की माँ"), ("खाना", "भोजन"),
    ("रोटी", "चपाती"), ("चावल", "भात"), ("दाल", "एक प्रकार का अन्न"),
    ("दूध", "सफ़ेद पेय"), ("दही", "जमा हुआ दूध"), ("चीनी", "शक्कर"),
    ("नमक", "लवण"), ("तेल", "स्निग्ध पदार्थ"), ("पूरी", "तली हुई रोटी"),
    ("सपना", "नींद में दिखता है"), ("जीवन", "ज़िंदगी"), ("मौत", "मृत्यु"),
    ("सुख", "दुःख का उल्टा"), ("दुःख", "पीड़ा"),
]

GRID_SIZE = 5

def get_word_len(word):
    """Calculates the true length of a Hindi word using graphemes."""
    return grapheme.length(word)

def get_graphemes(word):
    """Splits a Hindi word into a list of its true characters (graphemes)."""
    return list(grapheme.graphemes(word))

def can_place_word(grid, word, row, col, direction):
    graphemes = get_graphemes(word)
    word_len = len(graphemes)
    
    if direction == "across":
        if col + word_len > GRID_SIZE: return False
        for i in range(word_len):
            if grid[row][col + i] != "" and grid[row][col + i] != graphemes[i]:
                return False
    else:  # down
        if row + word_len > GRID_SIZE: return False
        for i in range(word_len):
            if grid[row + i][col] != "" and grid[row + i][col] != graphemes[i]:
                return False
    return True

def place_word(grid, word, row, col, direction):
    graphemes = get_graphemes(word)
    word_len = len(graphemes)

    if direction == "across":
        for i in range(word_len): grid[row][col + i] = graphemes[i]
    else:  # down
        for i in range(word_len): grid[row + i][col] = graphemes[i]

def generate_single_puzzle():
    for _ in range(100): # More attempts for better puzzle generation
        grid = [["" for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
        word_data = {}
        
        # <-- Important Change: Use get_word_len for filtering and sorting
        valid_words = [(w, c) for w, c in WORD_LIST if get_word_len(w) <= GRID_SIZE]
        valid_words.sort(key=lambda x: get_word_len(x[0]), reverse=True)
        
        if not valid_words: continue

        placed_words = set()
        
        # Try to place a few long words first
        for word, clue in valid_words:
            if random.random() > 0.5 and get_word_len(word) >= 4 : # Try placing long words
                direction = random.choice(["across", "down"])
                word_len = get_word_len(word)
                r = random.randint(0, GRID_SIZE - 1) if direction == "across" else random.randint(0, GRID_SIZE - word_len)
                c = random.randint(0, GRID_SIZE - word_len) if direction == "across" else random.randint(0, GRID_SIZE - 1)
                
                if can_place_word(grid, word, r, c, direction):
                    place_word(grid, word, r, c, direction)
                    word_data[word] = {"clue": clue, "row": r, "col": c, "direction": direction}
                    placed_words.add(word)
                    break
        
        if not placed_words: continue

        # Add crossing words
        for _ in range(25):
            potential_slots = [(r, c, char) for r, row_val in enumerate(grid) for c, char in enumerate(row_val) if char != ""]
            random.shuffle(potential_slots)
            
            word_placed_in_iter = False
            for r_slot, c_slot, letter in potential_slots:
                # Determine which direction to try placing a word
                is_part_of_across = any(wd["row"] == r_slot and c_slot >= wd["col"] and c_slot < wd["col"] + get_word_len(w) for w, wd in word_data.items() if wd["direction"] == "across")
                new_direction = "down" if is_part_of_across else "across"
                
                random.shuffle(valid_words)
                for new_word, new_clue in valid_words:
                    if new_word in placed_words: continue
                    
                    graphemes = get_graphemes(new_word)
                    for i, char in enumerate(graphemes):
                        if char == letter:
                            if new_direction == "across": new_col = c_slot - i
                            else: new_row = r_slot - i

                            if (new_direction == "across" and new_col >= 0 and can_place_word(grid, new_word, r_slot, new_col, new_direction)) or \
                               (new_direction == "down" and new_row >= 0 and can_place_word(grid, new_word, new_row, c_slot, new_direction)):
                                
                                r_place = r_slot if new_direction == "across" else new_row
                                c_place = new_col if new_direction == "across" else c_slot
                                
                                place_word(grid, new_word, r_place, c_place, new_direction)
                                word_data[new_word] = {"clue": new_clue, "row": r_place, "col": c_place, "direction": new_direction}
                                placed_words.add(new_word)
                                word_placed_in_iter = True
                                break
                    if word_placed_in_iter: break
                if word_placed_in_iter: break
        
        if len(word_data) >= 5: # We want reasonably dense puzzles
            return format_puzzle_json(grid, word_data)
    return None

def format_puzzle_json(grid, word_data):
    # This function doesn't need changes as it just deals with structured data
    puzzle, gridnums = {}, [[0]*GRID_SIZE for _ in range(GRID_SIZE)]
    across_clues, down_clues, answers_across, answers_down = [], [], {}, {}
    current_num, numbered_positions = 1, {}

    sorted_words = sorted(word_data.items(), key=lambda item: (item[1]["row"], item[1]["col"]))

    for word, data in sorted_words:
        r, c = data['row'], data['col']
        if (r, c) not in numbered_positions:
            is_across_start = any(d["row"] == r and d["col"] == c and d["direction"] == "across" for w, d in sorted_words)
            is_down_start = any(d["row"] == r and d["col"] == c and d["direction"] == "down" for w, d in sorted_words)
            if (data["direction"] == "across" and is_across_start) or (data["direction"] == "down" and is_down_start):
                 numbered_positions[(r, c)] = current_num
                 gridnums[r][c] = current_num
                 current_num += 1
        
        if gridnums[r][c] > 0:
            num = gridnums[r][c]
        else:
            # Word starts on a crossing point that's already numbered
            for key, val in numbered_positions.items():
                if data["direction"] == "across" and key[0] == r and key[1] <= c and key[1] + get_word_len(word_data[word]["clue"]) > c:
                    num = val
                    break
                if data["direction"] == "down" and key[1] == c and key[0] <= r and key[0] + get_word_len(word_data[word]["clue"]) > r:
                    num = val
                    break
        
        clue_list = across_clues if data["direction"] == "across" else down_clues
        answer_dict = answers_across if data["direction"] == "across" else answers_down
        
        if not any(clue['number'] == num for clue in clue_list):
            clue_list.append({"number": num, "clue": data["clue"]})
        answer_dict[str(num)] = word

    puzzle["grid"] = [cell for row in grid for cell in row]
    puzzle["gridnums"] = [num for row in gridnums for num in row]
    puzzle["across_clues"] = sorted(across_clues, key=lambda x: x['number'])
    puzzle["down_clues"] = sorted(down_clues, key=lambda x: x['number'])
    puzzle["answers"] = {"across": answers_across, "down": answers_down}
    return puzzle

def main():
    puzzles = []
    print("Generating 100 Hindi crossword puzzles (this may take a moment)...")
    while len(puzzles) < 100:
        puzzle = generate_single_puzzle()
        if puzzle:
            puzzles.append(puzzle)
            print(f"Generated puzzle #{len(puzzles)}")
            
    if not os.path.exists('public'): os.makedirs('public')
    file_path = os.path.join('public', 'hindi_crosswords.json')
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(puzzles, f, ensure_ascii=False, indent=2)
    print(f"\nSuccessfully generated 100 puzzles in {file_path}")

if __name__ == "__main__":
    main()