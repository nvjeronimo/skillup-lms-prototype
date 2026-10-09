import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Dr. Ifeoma Adeyemi",
    role: "Lead instructor · Business Analytics with Python",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "You merge 5,000 orders with a customer table and get 5,240 rows. What is the most likely cause?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A merge returns one row per matching pair. If the key is repeated in the customer table, each of those orders is matched more than once and the row count grows.",
      options: [
        {
          id: "a",
          label: "Some customer ids appear more than once in the customer table",
          correct: true,
          feedback: "Correct. Check the key for duplicates before you merge, and the row count after.",
        },
        { id: "b", label: "Some orders have no customer", feedback: "Unmatched orders are dropped or kept with empty values. They do not add rows." },
        { id: "c", label: "pandas adds a header row for each file", feedback: "Headers become column names, not rows." },
        { id: "d", label: "The orders table holds missing values", feedback: "Missing values do not multiply rows." },
      ],
    },
    {
      question: "Why hold back a test set when you fit a model?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A model can fit the data it was trained on very well and still predict badly. Only data it has not seen shows how it will behave on next month's numbers.",
      options: [
        { id: "a", label: "To make training faster", feedback: "Speed is a side effect. The reason is an honest measure of error." },
        { id: "b", label: "To measure how the model performs on data it has not seen", correct: true, feedback: "Correct. That is the only error that matters for a decision." },
        { id: "c", label: "Because scikit-learn requires it", feedback: "The library will fit on all the data if you ask. The discipline is yours." },
        { id: "d", label: "To remove outliers", feedback: "Splitting does not clean the data." },
      ],
    },
    {
      question: "A forecast model has an error of 12% on held-out weeks. What do you need before you call that good?",
      explanation:
        "An error means little alone. Compare it with a naive baseline, such as the same week last year: if the baseline is at 11%, the model has added nothing.",
      options: [
        { id: "a", label: "A more complex model", feedback: "Complexity is not evidence. First find out what there is to beat." },
        { id: "b", label: "The error of a simple baseline on the same weeks", correct: true, feedback: "Correct. A model is good only by comparison with the simple alternative." },
        { id: "c", label: "More decimal places", feedback: "Precision in the report does not change the result." },
        { id: "d", label: "The error on the training weeks", feedback: "Training error is almost always lower and tells you little." },
      ],
    },
  ],
  articles: {
    "bap-m1-t1": {
      lede: "Before any analysis, you need a Python installation that will behave the same way next week and on a colleague's machine. This reading sets one up in about fifteen minutes: Python itself, a separate environment for the course, the packages, and a check that everything works.",
      sections: [
        {
          heading: "Install Python and create an environment",
          paragraphs: [
            "The course uses Python 3.11 or later. Install it from python.org or with the package manager of your system, then open a terminal and run python --version to confirm which version answers. If you already have an older Python for other work, leave it in place.",
            "Create a folder for the course and, inside it, an environment: python -m venv .venv. An environment is a private copy of Python and its packages for one project. Activate it each time you open a terminal for the course: source .venv/bin/activate on macOS and Linux, .venv\\Scripts\\activate on Windows. The prompt then shows (.venv).",
          ],
        },
        {
          heading: "Install the packages",
          paragraphs: [
            "With the environment active, install what the course uses: pip install pandas matplotlib seaborn scikit-learn jupyterlab openpyxl. pandas handles tables, matplotlib and seaborn draw charts, scikit-learn fits models, JupyterLab runs notebooks and openpyxl lets pandas read Excel files.",
            "Then record what you installed: pip freeze > requirements.txt. That file lists every package with its exact version. Anyone, including you on a new laptop, can rebuild the same environment from it with pip install -r requirements.txt. Results that cannot be reproduced are hard to defend in a meeting.",
          ],
        },
        {
          heading: "Check that it works",
          paragraphs: [
            "Download the sales sample from Handouts and unzip it into a data folder inside your course folder. Start JupyterLab with the command jupyter lab, create a notebook, and run two lines: import pandas as pd, then pd.read_csv(\"data/orders.csv\").head(). You should see the first five orders as a table.",
            "If the import fails, the notebook is almost always running outside your environment: close it, activate the environment and start JupyterLab again from that terminal. If you cannot install software on your machine, a hosted notebook service works for this course, as long as it offers Python 3.11, pandas 2 and file upload. Do not upload your employer's data to a service your employer has not approved.",
          ],
        },
      ],
      pullQuote: {
        text: "An analysis you cannot rerun is an opinion with a chart attached.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Use Python 3.11 or later, in an environment created for this course.",
        "Install the six packages and save their versions in requirements.txt.",
        "Start JupyterLab from the terminal where the environment is active.",
        "Confirm the setup by loading orders.csv from the sales sample.",
      ],
    },
    "bap-m1-t3": {
      lede: "This course assumes you have written some Python before. This reading is the part of the language you will use every day with pandas, and nothing more: the types that hold business data, functions, and the comprehension, which replaces most short loops.",
      sections: [
        {
          heading: "The types that matter",
          paragraphs: [
            "Numbers come as int and float. Money held as a float shows rounding artefacts (0.1 + 0.2 is not exactly 0.3), so round at the point of reporting, not in the middle of a calculation. Text is str; dates should become datetime values as early as possible, because text that looks like a date sorts alphabetically, not by time.",
            "A list keeps items in order: the months of a quarter. A dict maps keys to values: a product code to its price. Most of what you pass to pandas is one of these two. A DataFrame, which you meet in the next lesson, behaves much like a dict of columns.",
          ],
        },
        {
          heading: "Functions, so that a rule is written once",
          paragraphs: [
            "Whenever a business rule appears in your analysis, such as how a margin is calculated or what counts as an active customer, put it in a function with a name. def gross_margin(revenue, cost): return (revenue - cost) / revenue. The rule then lives in one place, and when finance changes the definition you change one line.",
            "Give arguments clear names and return a value instead of printing it. A function that returns can be tested with two or three known cases before you trust it on fifty thousand rows.",
          ],
        },
        {
          heading: "Comprehensions",
          paragraphs: [
            "A comprehension builds a list or dict from another in one readable line. [p * 1.2 for p in prices] gives every price with 20% added. Add a condition to filter: [o for o in orders if o[\"status\"] == \"paid\"].",
            "Use them for small jobs on plain Python objects. Once the data is in a DataFrame, prefer the column operations of pandas: they are shorter, and far faster on large tables. A loop over the rows of a DataFrame is usually a sign that a pandas method exists for the job.",
          ],
        },
      ],
      pullQuote: {
        text: "Put each business rule in one named function. The day the definition changes, you will change one line.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Convert dates to datetime early; round money only when you report it.",
        "Lists keep order, dicts map keys to values.",
        "Write each business rule as a named function that returns a value.",
        "Use comprehensions for small jobs and pandas operations for tables.",
      ],
    },
  },
  quizzes: {
    "bap-m1-t8": [
      {
        question: "orders is a DataFrame. What does orders[orders[\"total\"] > 100] return?",
        platformPrompt: "Choose the correct option",
        hints: [
          "The inner expression produces one True or False per row.",
          "A DataFrame indexed with a column of booleans keeps some rows and drops others.",
        ],
        explanation:
          "The comparison builds a boolean Series, one value per row. Indexing the DataFrame with it keeps the rows where the value is True, with all their columns.",
        reviewTopicId: "bap-m1-t7",
        reviewTopicTitle: "Selecting, filtering and sorting",
        options: [
          { id: "a", label: "The total column, with values over 100 only", feedback: "It returns whole rows, not one column." },
          {
            id: "b",
            label: "The rows whose total is over 100, with all their columns",
            correct: true,
            feedback: "Correct. A boolean mask selects rows.",
          },
          { id: "c", label: "True or False for each row", feedback: "That is the inner expression alone, before it is used as a mask." },
          { id: "d", label: "The number of orders over 100", feedback: "For a count you would add len() or .shape[0]." },
        ],
      },
      {
        question: "A CSV of orders has a column order_date. After pd.read_csv, its dtype is object. What should you do before analysing by month?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A dtype of object means the dates were read as text. Convert them with pd.to_datetime, or with parse_dates when reading, so that sorting, resampling and month extraction work on time, not on characters.",
        reviewTopicId: "bap-m1-t6",
        reviewTopicTitle: "Loading data: CSV, Excel and SQL",
        options: [
          { id: "a", label: "Nothing: pandas treats text dates as dates", feedback: "Text sorts alphabetically, so “10/01” comes before “2/01”." },
          {
            id: "b",
            label: "Convert the column with pd.to_datetime, or read it with parse_dates",
            correct: true,
            feedback: "Correct. Dates must be datetime values before any analysis over time.",
          },
          { id: "c", label: "Split the text on “/” and keep the middle part", feedback: "It may work on one file and fail on the next. Use the datetime type." },
          { id: "d", label: "Delete the rows with dates", feedback: "The column holds the information you need." },
        ],
      },
      {
        question: "What is the difference between .loc and .iloc?",
        explanation:
          ".loc selects by label: index values and column names. .iloc selects by position, counting from zero. They give the same result only when the index happens to be 0, 1, 2 and so on.",
        reviewTopicId: "bap-m1-t7",
        reviewTopicTitle: "Selecting, filtering and sorting",
        options: [
          { id: "a", label: ".loc selects by label, .iloc by integer position", correct: true, feedback: "Correct. Labels against positions." },
          { id: "b", label: ".loc is for rows, .iloc for columns", feedback: "Both take rows and columns." },
          { id: "c", label: ".iloc is the newer name for .loc", feedback: "They are two different selectors." },
          { id: "d", label: ".loc returns a copy, .iloc a view", feedback: "Whether you get a copy depends on the operation, not on which of the two you use." },
        ],
      },
    ],
  },
  assignments: {
    "bap-m2-t9": {
      brief:
        "The Downloads tab holds a raw export of 5,000 orders from a fictional online retailer, with the faults a real export has: missing customer ids, dates in two formats, duplicated rows and a few impossible quantities. Clean it in a notebook, explaining each decision in a line of text above the cell. Then answer three questions with pandas: revenue by month, the ten products with the highest revenue, and the share of revenue that comes from repeat customers. Export the finished notebook as a PDF and submit it.",
      requirements: [
        "The notebook runs from top to bottom after a kernel restart",
        "Each cleaning step states what was found, what you did and how many rows it affected",
        "The three answers as tables, each with one sentence that reads the result",
        "A requirements.txt with the versions you used",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
