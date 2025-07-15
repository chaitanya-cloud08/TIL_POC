import json
import random
import os
import regex # <-- Make sure to 'pip install regex'

# Helper function to correctly split Hindi words into graphemes (e.g., 'कहानी' -> ['क', 'हा', 'नी'])
def get_graphemes(word):
    return regex.findall(r'\X', word, regex.UNICODE)

# Harder word list with clues
WORD_LIST = [
    ("न्याय", "कानून में जो मिलता है"), ("तर्क", "किसी बात का कारण"), ("ज्ञान", "शिक्षा से जो मिलता है"),
    ("धर्म", "आस्था का एक मार्ग"), ("कर्म", "जैसा करोगे, वैसा भरोगे"), ("शांति", "युद्ध का विलोम"),
    ("क्रोध", "अत्यधिक गुस्सा"), ("प्रेम", "स्नेह का भाव"), ("स्वप्न", "नींद में दिखने वाला दृश्य"),
    ("आत्मा", "शरीर में रहने वाली चेतना"), ("चिंता", "भविष्य की व्यर्थ फ़िक्र"), ("बलिदान", "किसी बड़े उद्देश्य के लिए त्याग"),
    ("अस्त्र", "फेंक कर चलाया जाने वाला हथियार"), ("शस्त्र", "हाथ में पकड़कर लड़ने का हथियार"), ("दुर्ग", "राजा का সুরক্ষিত किला"),
    ("शपथ", "कसम खाने की क्रिया"), ("काव्य", "कविता का दूसरा नाम"), ("ग्रंथ", "एक बड़ी और महत्वपूर्ण पुस्तक"),
    ("मुद्रा", "देश की करेंसी"), ("मंत्र", "पूजा में जपे जाने वाले शब्द"), ("अग्नि", "आग का शुद्ध रूप"),
    ("विजय", "जीत का जश्न"), ("विरासत", "जो पूर्वजों से मिले"), ("अणु", "पदार्थ का सबसे छोटा कण"),
    ("सूर्य", "हमारे सौरमंडल का तारा"), ("चंद्र", "पृथ्वी का उपग्रह"), ("लोहा", "एक मज़बूत धातु"),
    ("सोना", "एक कीमती पीली धातु"), ("हीरा", "सबसे कठोर पदार्थ"), ("रक्त", "शरीर में बहने वाला लाल तरल"),
    ("हृदय", "रक्त पंप करने वाला अंग"), ("सागर", "पानी का अथाह भंडार"), ("पवन", "हवा का तीव्र झोंका"),
    ("शिखर", "पर्वत की चोटी"), ("नींव", "इमारत का आधार"), ("तूफान", "प्रकृति का विनाशकारी रूप"),
    ("उजाला", "अंधेरे को जो खत्म करे"),
]

GRID_SIZE = 5

def can_place_word(grid, word_graphemes, row, col, direction):
    word_len = len(word_graphemes)
    if direction == "across":
        if col + word_len > GRID_SIZE: return False
        for i in range(word_len):
            if grid[row][col + i] not in ("", word_graphemes[i]): return False
    else:  # down
        if row + word_len > GRID_SIZE: return False
        for i in range(word_len):
            if grid[row + i][col] not in ("", word_graphemes[i]): return False
    return True

def place_word(grid, word_graphemes, row, col, direction):
    for i, grapheme in enumerate(word_graphemes):
        if direction == "across":
            grid[row][col + i] = grapheme
        else:
            grid[row + i][col] = grapheme

def generate_single_puzzle():
    for _ in range(500):
        grid = [["" for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
        word_data = {}
        placed_words = set()
        
        valid_words = [(w, c) for w, c in WORD_LIST if len(get_graphemes(w)) <= GRID_SIZE]
        if not valid_words: continue

        try:
            word, clue = random.choice(valid_words)
        except IndexError:
            continue
        
        word_graphemes = get_graphemes(word)
        word_len = len(word_graphemes)
        direction = random.choice(["across", "down"])
        r = random.randint(0, GRID_SIZE - 1) if direction == "across" else random.randint(0, GRID_SIZE - word_len)
        c = random.randint(0, GRID_SIZE - word_len) if direction == "across" else random.randint(0, GRID_SIZE - 1)
        place_word(grid, word_graphemes, r, c, direction)
        word_data[word] = {"clue": clue, "row": r, "col": c, "direction": direction}
        placed_words.add(word)

        for _ in range(30):
            potential_slots = [(r, c, char) for r, row_val in enumerate(grid) for c, char in enumerate(row_val) if char != ""]
            random.shuffle(potential_slots)
            
            word_placed = False
            for r_slot, c_slot, letter in potential_slots:
                new_direction = "down" if any(wd["row"] == r_slot and c_slot >= wd["col"] and c_slot < wd["col"] + len(get_graphemes(w)) for w, wd in word_data.items() if wd["direction"] == "across") else "across"
                
                random.shuffle(valid_words)
                for new_word, new_clue in valid_words:
                    if new_word in placed_words: continue
                    new_word_graphemes = get_graphemes(new_word)
                    if letter in new_word_graphemes:
                        idx = new_word_graphemes.index(letter)
                        if new_direction == "across":
                            if can_place_word(grid, new_word_graphemes, r_slot, c_slot - idx, new_direction):
                                place_word(grid, new_word_graphemes, r_slot, c_slot - idx, new_direction); word_placed = True
                        else:
                            if can_place_word(grid, new_word_graphemes, r_slot - idx, c_slot, new_direction):
                                place_word(grid, new_word_graphemes, r_slot - idx, c_slot, new_direction); word_placed = True
                        if word_placed:
                            word_data[new_word] = {"clue": new_clue, "row": r_slot - idx if new_direction == "down" else r_slot, "col": c_slot if new_direction == "down" else c_slot - idx, "direction": new_direction}
                            placed_words.add(new_word); break
                if word_placed: break
        
        if len(word_data) >= 5: return format_puzzle_json(grid, word_data)
    return None

def format_puzzle_json(grid, word_data):
    puzzle, gridnums = {}, [[0]*GRID_SIZE for _ in range(GRID_SIZE)]; across_clues, down_clues, answers_across, answers_down = [], [], {}, {}; current_num, numbered_positions = 1, {}; sorted_words = sorted(word_data.items(), key=lambda item: (item[1]["row"], item[1]["col"]));
    for word, data in sorted_words:
        r, c = data['row'], data['col']
        if (r, c) not in numbered_positions: numbered_positions[(r, c)] = current_num; gridnums[r][c] = current_num; current_num += 1
        num = numbered_positions[(r, c)]; clue_list = across_clues if data["direction"] == "across" else down_clues; answer_dict = answers_across if data["direction"] == "across" else answers_down
        if not any(clue['number'] == num for clue in clue_list): clue_list.append({"number": num, "clue": data["clue"]})
        answer_dict[str(num)] = word
    puzzle["grid"] = [cell for row in grid for cell in row]; puzzle["gridnums"] = [num for row in gridnums for num in row]; puzzle["across_clues"] = sorted(across_clues, key=lambda x: x['number']); puzzle["down_clues"] = sorted(down_clues, key=lambda x: x['number']); puzzle["answers"] = {"across": answers_across, "down": answers_down}; return puzzle

def main():
    puzzles = []
    print("Generating 100 hard Hindi crossword puzzles...");
    while len(puzzles) < 100:
        puzzle = generate_single_puzzle()
        if puzzle: puzzles.append(puzzle); print(f"Generated puzzle #{len(puzzles)}")
    if not os.path.exists('public'): os.makedirs('public')
    file_path = os.path.join('public', 'hindi_crosswords.json');
    with open(file_path, "w", encoding="utf-8") as f: json.dump(puzzles, f, ensure_ascii=False, indent=2)
    print(f"\nSuccessfully generated 100 puzzles in {file_path}")

if __name__ == "__main__":
    main()