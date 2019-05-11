-- Test data consists of two owners, each creating one game.
-- Owner 1's game has 5 mulitiple-choice questions.
-- Owner 2's game has 5 true/false questions
-- Game responses include order in which teams responded to the question and the points they scored for that question.
-- Note that some gameresponses records are commented out to imitate teams not responding to a question.

insert into owners
  (ownerName)
values
  ("Wish You Were Beer"),
  ("The Tipsy Cow")
;

insert into games
  (ownerId_fk, questions)
values
  (1, "[
  {
  question: 'Owner 1, first question', 
  answer1: 'answer1',
  answer2: 'answer2',
  answer3: 'answer3',
  answer4: 'answer4', 
  correctAnswer: 'answer1'
  },
  {
    question: 'Owner 1, second question', 
    answer1: 'answer1',
    answer2: 'answer2',
    answer3: 'answer3',
    answer4: 'answer4', 
    correctAnswer: 'answer2'
    },
  {
    question: 'Owner 1, third question', 
    answer1: 'answer1',
    answer2: 'answer2',
    answer3: 'answer3',
    answer4: 'answer4', 
    correctAnswer: 'answer3'
    },
  {
    question: 'Owner 1, fourth question', 
    answer1: 'answer1',
    answer2: 'answer2',
    answer3: 'answer3',
    answer4: 'answer4', 
    correctAnswer: 'answer4'
    },
  {
    question: 'Owner 1, fifth question', 
    answer1: 'answer1',
    answer2: 'answer2',
    answer3: 'answer3',
    answer4: 'answer4', 
    correctAnswer: 'answer1'
    }
]"),
  (2, "[
  {
  question: 'Owner 2, first question', 
  answer1: 'true',
  answer2: 'false',
  answer3: '',
  answer4: '', 
  correctAnswer: 'true'
  },
  {
  question: 'Owner 2, second question', 
  answer1: 'true',
  answer2: 'false',
  answer3: '',
  answer4: '', 
  correctAnswer: 'false'
  },
  {
  question: 'Owner 2, third question', 
  answer1: 'true',
  answer2: 'false',
  answer3: '',
  answer4: '', 
  correctAnswer: 'true'
  },
  {
  question: 'Owner 2, fourth question', 
  answer1: 'true',
  answer2: 'false',
  answer3: '',
  answer4: '', 
  correctAnswer: 'false'
  },
  {
  question: 'Owner 2, fifth question', 
  answer1: 'true',
  answer2: 'false',
  answer3: '',
  answer4: '', 
  correctAnswer: 'answtrueer1'
  }
]")
;

insert into gameresponses
  (ownerId_fk, questionNumber_fk, teamName, answerGiven, responseOrder, points)
values
  (1, 1, "team 1", "answer1", 1, 3),
  (1, 1, "team 2", "answer1", 2, 2),
  (1, 1, "team 3", "answer1", 3, 1),
  (1, 1, "team 4", "answer1", 4, 1),
  (1, 1, "team 5", "answer2", 5, 0),
  (1, 1, "team 6", "answer2", 6, 0),
  (1, 1, "team 7", "answer3", 7, 0),
  (1, 1, "team 8", "answer3", 8, 0),
  (1, 1, "team 9", "answer3", 9, 0),
  (1, 1, "team 10", "answer4", 10, 0),
  -- --------------------------------
  (1, 2, "team 1", "answer1", 1, 0),
  (1, 2, "team 2", "answer1", 2, 0),
  (1, 2, "team 3", "answer1", 3, 0),
  (1, 2, "team 4", "answer1", 4, 0),
  (1, 2, "team 5", "answer2", 5, 3),
  (1, 2, "team 6", "answer2", 6, 2),
  (1, 2, "team 7", "answer2", 7, 1),
  (1, 2, "team 8", "answer3", 8, 0),
  (1, 2, "team 9", "answer3", 9, 0),
  (1, 2, "team 10", "answer4", 10, 0),
  -- --------------------------------
  (1, 3, "team 1", "answer1", 1, 0),
  (1, 3, "team 2", "answer1", 2, 0),
  (1, 3, "team 3", "answer1", 3, 0),
  (1, 3, "team 4", "answer1", 4, 0),
  (1, 3, "team 5", "answer2", 5, 0),
  (1, 3, "team 6", "answer2", 6, 0),
  (1, 3, "team 7", "answer2", 7, 0),
  (1, 3, "team 8", "answer3", 8, 3),
  (1, 3, "team 9", "answer3", 9, 2),
  (1, 3, "team 10", "answer4", 10, 0),
  -- --------------------------------
  (1, 4, "team 1", "answer1", 1, 0),
  (1, 4, "team 2", "answer1", 2, 0),
  (1, 4, "team 3", "answer1", 3, 0),
  -- (1, 4, "team 5", "answer2", 5, 0),
  -- (1, 4, "team 6", "answer2", 6, 0),
  -- (1, 4, "team 7", "answer2", 7, 0),
  (1, 4, "team 8", "answer3", 8, 0),
  (1, 4, "team 9", "answer3", 9, 0),
  (1, 4, "team 10", "answer4", 10, 3),
  -- --------------------------------
  (1, 5, "team 1", "answer1", 1, 3),
  (1, 5, "team 2", "answer1", 2, 2),
  (1, 5, "team 3", "answer1", 3, 1),
  (1, 5, "team 4", "answer1", 4, 1),
  (1, 5, "team 5", "answer2", 5, 0),
  (1, 5, "team 6", "answer2", 6, 0),
  -- (1, 5, "team 7", "answer2", 7, 0),
  -- (1, 5, "team 8", "answer3", 8, 0),
  -- (1, 5, "team 9", "answer3", 9, 0),
  -- (1, 5, "team 10", "answer4", 10, 0),
  -- --------------------------------
  -- --------------------------------
  (2, 1, "team 1", "true", 1, 3),
  (2, 1, "team 2", "false", 2, 0),
  (2, 1, "team 3", "true", 3, 2),
  (2, 1, "team 4", "false", 4, 0),
  (2, 1, "team 5", "true", 5, 1),
  -- --------------------------------
  (2, 2, "team 1", "false", 1, 3),
  (2, 2, "team 2", "true", 2, 0),
  (2, 2, "team 3", "false", 3, 2),
  (2, 2, "team 4", "true", 4, 0),
  (2, 2, "team 5", "false", 5, 1),
  -- --------------------------------
  -- (2, 3, "team 1", "true", 1, 0),
  -- 2, 3, "team 2", "true", 2, 0),
  (2, 3, "team 3", "true", 3, 3),
  (2, 3, "team 4", "true", 4, 2),
  (2, 3, "team 5", "true", 5, 1),
  -- --------------------------------
  (2, 4, "team 1", "true", 1, 0),
  (2, 4, "team 2", "true", 2, 0),
  (2, 4, "team 3", "true", 3, 0),
  (2, 4, "team 4", "true", 4, 0),
  (2, 4, "team 5", "false", 5, 0),
  -- --------------------------------
  -- (2, 5, "team 1", "true", 1, 0),
  (2, 5, "team 2", "false", 2, 0),
  (2, 5, "team 3", "true", 3, 3),
  (2, 5, "team 4", "false", 4, 0),
  (2, 5, "team 5", "true", 5, 2)
