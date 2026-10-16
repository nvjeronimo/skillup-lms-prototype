import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Business Analytics with Python". All of Module 1 is written (the three
 * video transcripts are in the outline), then the lab of every module, the podcast, two
 * readings of Module 2 and both assignments. The retailer of the sales sample and Harbour
 * Lane Grocers, where the podcast guest works, are made up for the course.
 */
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
    "bap-m2-t2": {
      lede: "Most wrong answers in business analysis come from a column that holds the right values in the wrong type. This reading covers the three types that cause the trouble: numbers read as text, dates, and categories.",
      sections: [
        {
          heading: "Numbers that are not numbers",
          paragraphs: [
            "Run orders.dtypes on a fresh export and look for object where you expected a number. One stray value is enough: a quantity typed as “2 units”, a price with a currency sign, a thousands separator. pandas then stores the whole column as text, and a sum joins the characters together or fails.",
            "Convert with pd.to_numeric(orders[\"total\"], errors=\"coerce\"). The option turns whatever cannot be read into a missing value, which you can then count. If 3 values out of 5,000 failed, look at them one by one. If 800 failed, the column needs cleaning before conversion, usually by removing a symbol with str.replace.",
          ],
        },
        {
          heading: "Dates",
          paragraphs: [
            "A date kept as text sorts by its first character, so “10/01/2026” lands before “2/01/2026”. Convert with pd.to_datetime and name the format when you know it: format=\"%d/%m/%Y\". Without a format, pandas guesses, and a file that mixes day-first and month-first dates will be read wrongly without any error.",
            "Once the column is a datetime, the useful parts are one attribute away: orders[\"order_date\"].dt.month, .dt.to_period(\"M\") for a year and month, .dt.day_name() for the weekday. Check the earliest and latest date after converting. An order dated 1970 or 2062 is a conversion fault, not a customer.",
          ],
        },
        {
          heading: "Categories",
          paragraphs: [
            "Region, channel and status are categories: a small set of allowed values repeated over many rows. List them with value_counts() before you group by them. “North”, “north” and “North ” with a trailing space are three groups to pandas and one region to the business.",
            "Tidy the text first with str.strip() and str.title(), then convert with astype(\"category\"). The column takes less memory, and you can give it an order, such as bronze, silver, gold, so that tables and charts follow the order of the business and not the alphabet.",
          ],
        },
      ],
      pullQuote: {
        text: "Check the type of every column before you trust a single total.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Read dtypes first; object in a numeric column means at least one bad value.",
        "Convert with errors=\"coerce\", then count and inspect what failed.",
        "Name the date format, and check the earliest and latest date afterwards.",
        "Clean category text before grouping, and set an order where the business has one.",
      ],
    },
    "bap-m2-t6": {
      lede: "A merge combines two tables on a shared key. It is also the step where rows disappear or multiply without any warning. This reading shows how to choose the kind of merge and how to prove that the result has the rows you expect.",
      sections: [
        {
          heading: "Which rows do you want to keep?",
          paragraphs: [
            "pd.merge(orders, customers, on=\"customer_id\", how=\"left\") keeps every order and adds the customer's columns where a match exists. An inner merge keeps only orders with a known customer. The choice is a business decision: for revenue you want every order, known customer or not, so left is the safe default with the orders table on the left.",
            "After a left merge, the orders with no match carry missing values in the customer columns. Count them. In the sales sample, 140 orders have no customer id: they are guest checkouts, and they belong in the revenue total but not in a count of customers.",
          ],
        },
        {
          heading: "Why rows multiply",
          paragraphs: [
            "A merge returns one row for each matching pair. If a customer id appears twice in the customer table, every order of that customer appears twice in the result, and its revenue is counted twice. Nothing fails. The total is simply too high.",
            "Before merging, test the key on the side that should be unique: customers[\"customer_id\"].is_unique. Or let pandas enforce it with validate=\"many_to_one\", which raises an error if the right-hand table repeats a key. An error at this step is cheaper than a wrong figure in a report.",
          ],
        },
        {
          heading: "Three checks after every merge",
          paragraphs: [
            "First, compare row counts: a left merge on a unique key returns exactly as many rows as the left table. Second, compare a total you already know, such as revenue, before and after. Third, add indicator=True and read the _merge column to see how many rows matched on both sides and how many on one only.",
            "Write the three results in a line of text under the cell. A reader who sees “5,000 rows before, 5,000 after, revenue unchanged” does not need to rerun your work to trust it.",
          ],
        },
      ],
      pullQuote: {
        text: "A merge that doubles a row does not fail. It gives you a larger number, and larger numbers are rarely questioned.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Choose the kind of merge from the question: which rows must survive?",
        "Test that the key is unique on the lookup side, or use validate.",
        "Compare row counts and one known total before and after.",
        "Use indicator=True to see what matched and what did not.",
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
    "bap-m1-t9": [
      {
        question: "A notebook runs without error on your machine, but a colleague gets a NameError on the third cell. What is the most likely reason?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The kernel remembers every variable defined since it started, including ones from cells you later deleted or ran out of order. Restarting the kernel and running all cells from the top shows what a colleague will see.",
        reviewTopicId: "bap-m1-t2",
        reviewTopicTitle: "A tour of the notebook: cells, kernels and output",
        options: [
          { id: "a", label: "Your colleague has a slower computer", feedback: "Speed does not change which names are defined." },
          {
            id: "b",
            label: "A variable was defined in a cell that was deleted or run out of order",
            correct: true,
            feedback: "Correct. Your kernel still holds the variable; a fresh one does not.",
          },
          { id: "c", label: "Notebooks cannot be shared between machines", feedback: "They can. What must be rebuilt is the kernel's memory, by running the cells in order." },
          { id: "d", label: "pandas was imported twice", feedback: "Importing twice is harmless." },
        ],
      },
      {
        question: "orders has the columns price and quantity. Which line adds the revenue of each order as a new column?",
        platformPrompt: "Choose the correct option",
        explanation:
          "pandas works on whole columns: multiplying two Series multiplies them row by row, lined up on the index. No loop is needed, and the result is assigned to a new column by name.",
        reviewTopicId: "bap-m1-t5",
        reviewTopicTitle: "DataFrames and Series: the mental model",
        options: [
          { id: "a", label: "orders[\"revenue\"] = orders[\"price\"] * orders[\"quantity\"]", correct: true, feedback: "Correct. One line, applied to every row." },
          { id: "b", label: "orders.revenue(price * quantity)", feedback: "revenue is not a method, and price and quantity are not variables." },
          { id: "c", label: "for row in orders: row[\"revenue\"] = row[\"price\"] * row[\"quantity\"]", feedback: "Looping over a DataFrame yields its column names, not its rows." },
          { id: "d", label: "orders[\"revenue\"] = sum(orders[\"price\"], orders[\"quantity\"])", feedback: "sum adds values together. It does not multiply columns." },
        ],
      },
      {
        question: "You filter 5,000 orders to those from the North region with a total over 100 and get 0 rows. What should you check first?",
        explanation:
          "A result of zero rows is far more often a fault in the condition than a fact about the business. List the values of the column with value_counts(): a different spelling, a capital letter or a trailing space is the usual cause.",
        reviewTopicId: "bap-m1-t7",
        reviewTopicTitle: "Selecting, filtering and sorting",
        options: [
          { id: "a", label: "Nothing: the North region has no large orders", feedback: "Possible, but check the condition before you report it." },
          {
            id: "b",
            label: "How the region is written in the data, with value_counts()",
            correct: true,
            feedback: "Correct. “north” or “North ” would match nothing.",
          },
          { id: "c", label: "Whether the file is too large for pandas", feedback: "5,000 rows is a very small table." },
          { id: "d", label: "The version of matplotlib", feedback: "Charting is not involved in a filter." },
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
    "bap-m4-t9": {
      brief:
        "The Downloads tab holds 104 weeks of unit sales for one product line of the fictional retailer. Hold back the last 12 weeks. Build a naive baseline (the same week one year earlier), then one model of your choice, and compare the two on the held-out weeks with the mean absolute percentage error. Finish with a short paragraph for the supply planner: which forecast you would use for the next 12 weeks, and how wrong it is likely to be. Export the notebook as a PDF and submit it.",
      requirements: [
        "The notebook runs from top to bottom after a kernel restart",
        "The 12 held-out weeks are never used to fit or tune the model",
        "One table and one chart that compare baseline, model and actual sales",
        "A recommendation of at most 150 words that states the expected error",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
  labs: {
    "bap-m1-t4": {
      kind: "download",
      intro:
        "In this lab you run a prepared notebook on the sales sample: load 5,000 orders, look at their shape and types, and answer two first questions about them. Everything runs on your machine and nothing is submitted.",
      prerequisites: [
        "The course environment from “Python environment setup”, with JupyterLab started from it",
        "The sales sample from Handouts, unzipped into a data folder",
      ],
      steps: [
        "Download the notebook and save it in your course folder, next to the data folder.",
        "Restart the kernel and run the cells in order. Read the line of text above each cell before you run it.",
        "At cell 6, check that orders.shape returns (5000, 9). If it does not, the notebook is reading another file.",
        "Fill in the two empty cells: the number of orders per region, and the ten largest orders by total.",
        "Restart the kernel, run all cells from the top and confirm that the notebook still runs to the end.",
      ],
      files: [
        { name: "01_first_notebook.ipynb", kind: "notebook", size: "18 KB" },
        { name: "orders.csv", kind: "data", size: "412 KB" },
        { name: "Lab_01_worked_example.pdf", kind: "pdf", size: "640 KB" },
      ],
      estimatedMinutes: 30,
    },
    "bap-m2-t4": {
      kind: "download",
      intro:
        "In this lab you clean a raw export of 5,000 orders that has the faults a real export has: missing customer ids, dates in two formats, repeated rows and a few impossible quantities. You decide what to do with each fault and record how many rows it touched.",
      prerequisites: [
        "The course environment, with pandas 2 or later",
        "The readings and the episode on missing values of this lesson: the lab asks for the same three steps, find, explain, decide",
      ],
      steps: [
        "Download the notebook and the raw export into the same folder.",
        "Run the profiling cells: missing values per column, the type of each column, the number of repeated rows.",
        "Convert order_date to a datetime. Two formats are present, so convert in two passes and count what is left unconverted.",
        "Remove exact repeats, then decide what to do with the 37 orders whose quantity is zero or negative. Write your reason above the cell.",
        "Keep the 140 orders with no customer id and flag them in a new column, guest_checkout.",
        "Compare your final row count and total revenue with the worked example in the PDF.",
      ],
      files: [
        { name: "02_clean_orders.ipynb", kind: "notebook", size: "26 KB" },
        { name: "orders_export_raw.csv", kind: "data", size: "448 KB" },
        { name: "Lab_02_worked_example.pdf", kind: "pdf", size: "910 KB" },
      ],
      estimatedMinutes: 30,
    },
    "bap-m3-t5": {
      kind: "download",
      intro:
        "In this lab you turn the cleaned orders into three charts a sales manager could read in a minute: revenue by region, revenue by month and the share of each channel. The notebook gives you the grouped tables; you choose and build the charts.",
      prerequisites: [
        "The course environment, with matplotlib and seaborn",
        "The cleaned orders file of this lab, or your own result from the lab of Module 2",
      ],
      steps: [
        "Download the notebook and the cleaned orders into the same folder.",
        "Run the cells that group revenue by region, by month and by channel, and read each table before you chart it.",
        "Draw revenue by region as a horizontal bar chart, sorted from largest to smallest.",
        "Draw revenue by month as a line chart with the months in calendar order and the axis starting at zero.",
        "Draw the channel shares as one stacked bar. Then give every chart a title that states its finding, not its content.",
        "Save the three charts as PNG files and compare them with the worked example in the PDF.",
      ],
      files: [
        { name: "03_revenue_charts.ipynb", kind: "notebook", size: "31 KB" },
        { name: "orders_clean.csv", kind: "data", size: "396 KB" },
        { name: "Lab_03_worked_example.pdf", kind: "pdf", size: "1.4 MB" },
      ],
      estimatedMinutes: 30,
    },
    "bap-m4-t4": {
      kind: "download",
      intro:
        "In this lab you fit a linear regression of weekly units sold on price for one product, check it on weeks the model has not seen, and say in one sentence what a price change of 1 is expected to do to demand.",
      prerequisites: [
        "The course environment, with scikit-learn",
        "The video “Linear regression: what a coefficient means” and the reading on train and test sets",
      ],
      steps: [
        "Download the notebook and the weekly demand file into the same folder.",
        "Plot units against price before fitting anything, and note whether a straight line is a fair description.",
        "Hold back the last 20 of the 104 weeks as a test set. Fit the regression on the first 84.",
        "Read the coefficient of price and write its meaning as a sentence, with its unit.",
        "Measure the mean absolute error on the 20 test weeks and compare it with the error of predicting the average every week.",
        "Add the promotion flag as a second feature, fit again and note how the price coefficient changes.",
      ],
      files: [
        { name: "04_price_demand.ipynb", kind: "notebook", size: "29 KB" },
        { name: "weekly_demand.csv", kind: "data", size: "14 KB" },
        { name: "Lab_04_worked_example.pdf", kind: "pdf", size: "780 KB" },
      ],
      estimatedMinutes: 35,
    },
  },
  podcasts: {
    "bap-m2-t1": {
      host: "Dr. Ifeoma Adeyemi",
      guest: "Kofi Mensah, analytics lead at the fictional Harbour Lane Grocers",
      episodeLabel: "Episode 1",
      summary:
        "A conversation about what an empty cell means. Before you fill or drop a missing value, find out why it is missing: a guest checkout, a field added last year and a failed export leave the same gap and call for three different decisions.",
      chapters: [
        { ts: "0:00", label: "An empty cell is a question" },
        { ts: "2:40", label: "Find: count the gaps per column and per month" },
        { ts: "5:55", label: "Explain: ask the team that owns the system" },
        { ts: "9:10", label: "Decide: keep, fill or drop, and write it down" },
        { ts: "12:20", label: "What to say in the report" },
      ],
    },
  },
  lessonPages: {
    "bap-m1-t6": {
      intro:
        "Business data reaches you in three forms: a CSV export, an Excel workbook or a database table. This page shows how to load each into a DataFrame, and the checks to run before you trust what was loaded.",
      blocks: [
        {
          kind: "text",
          heading: "CSV: the common case",
          paragraphs: [
            "pd.read_csv(\"data/orders.csv\") is often enough. When it is not, three options solve most problems: sep for a file that uses semicolons, encoding for accented characters that come out garbled, and parse_dates=[\"order_date\"] so that dates arrive as dates.",
            "pandas guesses the type of each column from its values. The guess is usually right for numbers, and wrong for codes that only look like numbers.",
          ],
        },
        { kind: "video", title: "read_csv on the orders file, option by option", durationLabel: "4m 30s" },
        {
          kind: "callout",
          tone: "warning",
          title: "Codes are text, not numbers",
          body: "A postcode or product code such as 00420 becomes 420 when it is read as a number, and then no longer matches the product table. Read such columns as text: dtype={\"product_code\": str}.",
        },
        {
          kind: "text",
          heading: "Excel and SQL",
          paragraphs: [
            "pd.read_excel(\"data/targets.xlsx\", sheet_name=\"2026\") reads one sheet. Workbooks made for people often have a title and blank rows above the table: skip them with skiprows, and check that the header row is the one you expect.",
            "For a database, pd.read_sql(query, connection) returns the result of a query as a DataFrame. Select only the columns and the period you need. Filtering in the database is faster than loading a whole table and filtering in pandas.",
          ],
        },
        {
          kind: "text",
          heading: "Three checks after every load",
          paragraphs: [
            "Look at shape: does the row count match the source? Look at dtypes: are dates dates and amounts numbers? Look at head() and tail(): a total row at the bottom of an export will be counted as an order unless you remove it.",
          ],
        },
        { kind: "file", name: "Loading_data_cheat_sheet.pdf", fileKind: "pdf", size: "180 KB" },
        {
          kind: "knowledge-check",
          question: "After loading, orders.shape shows 5,001 rows, but the source system reports 5,000 orders. What is the most likely cause?",
          options: [
            { id: "a", label: "pandas counts the header as a row", feedback: "The header becomes the column names. It is not counted." },
            {
              id: "b",
              label: "The export ends with a total row",
              correct: true,
              feedback: "Correct. Look at tail() and remove the row before any sum.",
            },
            { id: "c", label: "One order has a missing value", feedback: "A missing value leaves the row count unchanged." },
          ],
        },
      ],
    },
  },
};
