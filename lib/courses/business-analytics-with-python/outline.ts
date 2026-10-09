import type { Course } from "@/lib/courses/kit";

/**
 * "Business Analytics with Python": a stand-alone course on My Learning, not started.
 * 44 topics, none done. No topic is flagged `active`: Start lands on the first topic,
 * "Python environment setup", the one the card names. The hands-on work is four Labs (one
 * per module, on the starter notebooks of Handouts), "Loading data" is a Lesson Page and
 * "Missing values" a Podcast: types changed on 9 Oct 2026, topic counts and durations kept.
 */
export const outline: Course = {
  id: "bap",
  slug: "business-analytics-with-python",
  title: "Business Analytics with Python",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Advanced",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 5,
  modules: [
    {
      id: "bap-m1",
      label: "MODULE 01",
      title: "Python for Analysts",
      topicsCompleted: 0,
      topicsTotal: 9,
      isCompleted: false,
      lessons: [
        {
          id: "bap-m1-l1",
          label: "Getting set up",
          topics: [
            { id: "bap-m1-t1", type: "Reading", title: "Python environment setup", duration: "approx. 15 min read", completed: false },
            {
              id: "bap-m1-t2",
              type: "Video",
              title: "A tour of the notebook: cells, kernels and output",
              duration: "12 min",
              completed: false,
              transcript: [
                { id: "bap-m1-t2-ln1", ts: "0:00", text: "A notebook is a document made of cells. Some hold text, some hold code, and under each code cell sits whatever that code returned." },
                { id: "bap-m1-t2-ln2", ts: "0:14", text: "Behind the document runs a kernel: a Python process that remembers every variable you have defined since it started." },
                { id: "bap-m1-t2-ln3", ts: "0:29", text: "That memory is the source of the most common notebook error. Cells run in the order you press them, not the order you read them." },
                { id: "bap-m1-t2-ln4", ts: "0:46", text: "Look at the number beside each cell. If it reads 12, then 7, then 15, the page no longer tells the story of what happened." },
                { id: "bap-m1-t2-ln5", ts: "1:03", text: "The fix is a habit: before you share or submit a notebook, restart the kernel and run all cells from the top. If it fails, a colleague would have failed too." },
                { id: "bap-m1-t2-ln6", ts: "1:22", text: "Keep one idea per cell, and put a line of text above any cell whose purpose is not obvious. You are writing for the person who opens this file in three months." },
                { id: "bap-m1-t2-ln7", ts: "1:40", text: "In the next reading you refresh the Python you need for the course. Then you run your first notebook on the sales sample." },
              ],
            },
            { id: "bap-m1-t3", type: "Reading", title: "Python refresher: types, functions and comprehensions", duration: "approx. 20 min read", completed: false },
            { id: "bap-m1-t4", type: "Lab", title: "Run your first notebook on the sales sample", duration: "approx. 30 min", completed: false },
          ],
        },
        {
          id: "bap-m1-l2",
          label: "pandas essentials",
          topics: [
            {
              id: "bap-m1-t5",
              type: "Video",
              title: "DataFrames and Series: the mental model",
              duration: "16 min",
              completed: false,
              transcript: [
                { id: "bap-m1-t5-ln1", ts: "0:00", text: "A DataFrame is a table: rows are records, columns are fields. If you have used a spreadsheet, you already know the shape." },
                { id: "bap-m1-t5-ln2", ts: "0:16", text: "Each column is a Series: one type of value, a date, a price, a region, with a label attached to every row." },
                { id: "bap-m1-t5-ln3", ts: "0:33", text: "Those labels are the index. By default it counts 0, 1, 2. It can also be an order id or a date, and that changes how you look rows up." },
                { id: "bap-m1-t5-ln4", ts: "0:52", text: "The difference from a spreadsheet is that you act on whole columns. Price times quantity gives a new column in one line, with no loop." },
                { id: "bap-m1-t5-ln5", ts: "1:10", text: "pandas lines values up by label, not by position. Add two Series with different indexes and you get missing values where the labels do not match." },
                { id: "bap-m1-t5-ln6", ts: "1:29", text: "So the first three things to ask of any DataFrame are its shape, its column types and what its index is. The methods are shape, dtypes and index." },
                { id: "bap-m1-t5-ln7", ts: "1:47", text: "Next you load real files into this structure. Keep the picture in mind: a table of typed columns that share one index." },
              ],
            },
            { id: "bap-m1-t6", type: "Lesson Page", title: "Loading data: CSV, Excel and SQL", duration: "approx. 15 min", completed: false },
            {
              id: "bap-m1-t7",
              type: "Video",
              title: "Selecting, filtering and sorting",
              duration: "15 min",
              completed: false,
              transcript: [
                { id: "bap-m1-t7-ln1", ts: "0:00", text: "Most analysis starts by cutting a table down: these columns, those rows, in this order. pandas has one tool for each." },
                { id: "bap-m1-t7-ln2", ts: "0:15", text: "To select columns, pass a list of names in square brackets. You get a smaller DataFrame with the same rows." },
                { id: "bap-m1-t7-ln3", ts: "0:31", text: "To filter rows, write a condition on a column. The result is a column of True and False, called a mask, and the mask keeps the rows marked True." },
                { id: "bap-m1-t7-ln4", ts: "0:50", text: "Combine conditions with the ampersand for and, the vertical bar for or, and put each condition in its own brackets." },
                { id: "bap-m1-t7-ln5", ts: "1:08", text: "Use loc when you want rows and columns in one step, by label. Use iloc when you mean positions, such as the first ten rows." },
                { id: "bap-m1-t7-ln6", ts: "1:26", text: "To sort, call sort_values with the column name. Sorting returns a new table: the original stays as it was unless you assign the result." },
                { id: "bap-m1-t7-ln7", ts: "1:44", text: "After every filter, check the row count. If 5,000 orders became 12, the condition is probably wrong, not the business." },
                { id: "bap-m1-t7-ln8", ts: "2:02", text: "The practice quiz that follows uses these three moves on the orders table." },
              ],
            },
            { id: "bap-m1-t8", type: "Practice Assignment", title: "Practice Quiz: pandas essentials", duration: "approx. 10 min", completed: false },
            { id: "bap-m1-t9", type: "Quiz", title: "Graded Quiz: Python and pandas foundations", duration: "approx. 12 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "bap-m2",
      label: "MODULE 02",
      title: "Cleaning and Reshaping Business Data",
      topicsCompleted: 0,
      topicsTotal: 9,
      isCompleted: false,
      lessons: [
        {
          id: "bap-m2-l1",
          label: "Cleaning",
          topics: [
            { id: "bap-m2-t1", type: "Podcast", title: "Missing values: find, explain, then decide", duration: "14 min", completed: false },
            { id: "bap-m2-t2", type: "Reading", title: "Types, dates and categories done properly", duration: "approx. 18 min read", completed: false },
            { id: "bap-m2-t3", type: "Video", title: "Duplicates, outliers and silent errors", duration: "15 min", completed: false },
            { id: "bap-m2-t4", type: "Lab", title: "Clean an orders export of 5,000 rows", duration: "approx. 30 min", completed: false },
          ],
        },
        {
          id: "bap-m2-l2",
          label: "Reshaping",
          topics: [
            { id: "bap-m2-t5", type: "Video", title: "groupby: split, apply, combine", duration: "18 min", completed: false },
            { id: "bap-m2-t6", type: "Reading", title: "Joins and merges without losing or doubling rows", duration: "approx. 18 min read", completed: false },
            { id: "bap-m2-t7", type: "Video", title: "Pivot tables and reshaping long to wide", duration: "14 min", completed: false },
            { id: "bap-m2-t8", type: "Practice Assignment", title: "Practice Quiz: Cleaning and reshaping", duration: "approx. 10 min", completed: false },
            { id: "bap-m2-t9", type: "Graded Assignment", title: "Assignment 01 · Clean and summarise a sales dataset", duration: "approx. 1 h", completed: false },
          ],
        },
      ],
    },
    {
      id: "bap-m3",
      label: "MODULE 03",
      title: "Exploring and Visualising",
      topicsCompleted: 0,
      topicsTotal: 9,
      isCompleted: false,
      lessons: [
        {
          id: "bap-m3-l1",
          label: "Exploration and charts",
          topics: [
            { id: "bap-m3-t1", type: "Video", title: "Exploratory analysis: a repeatable first hour", duration: "16 min", completed: false },
            { id: "bap-m3-t2", type: "Reading", title: "Descriptive statistics that answer business questions", duration: "approx. 18 min read", completed: false },
            { id: "bap-m3-t3", type: "Video", title: "Charts with matplotlib and seaborn", duration: "18 min", completed: false },
            { id: "bap-m3-t4", type: "Reading", title: "Choosing the chart for the comparison you are making", duration: "approx. 12 min read", completed: false },
            { id: "bap-m3-t5", type: "Lab", title: "Chart revenue by region, month and channel", duration: "approx. 30 min", completed: false },
          ],
        },
        {
          id: "bap-m3-l2",
          label: "Time and cohorts",
          topics: [
            { id: "bap-m3-t6", type: "Video", title: "Time series: resampling, rolling windows and seasonality", duration: "18 min", completed: false },
            { id: "bap-m3-t7", type: "Reading", title: "Customer cohorts and retention tables in pandas", duration: "approx. 18 min read", completed: false },
            { id: "bap-m3-t8", type: "Practice Assignment", title: "Practice Quiz: Exploring data", duration: "approx. 10 min", completed: false },
            { id: "bap-m3-t9", type: "Quiz", title: "Graded Quiz: Exploration and visualisation", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "bap-m4",
      label: "MODULE 04",
      title: "Models for Business Decisions",
      topicsCompleted: 0,
      topicsTotal: 9,
      isCompleted: false,
      lessons: [
        {
          id: "bap-m4-l1",
          label: "Regression",
          topics: [
            { id: "bap-m4-t1", type: "Video", title: "Linear regression: what a coefficient means", duration: "18 min", completed: false },
            { id: "bap-m4-t2", type: "Reading", title: "Train, test and the cost of overfitting", duration: "approx. 18 min read", completed: false },
            { id: "bap-m4-t3", type: "Video", title: "Fitting and checking a model with scikit-learn", duration: "20 min", completed: false },
            { id: "bap-m4-t4", type: "Lab", title: "Model the effect of price on weekly demand", duration: "approx. 35 min", completed: false },
          ],
        },
        {
          id: "bap-m4-l2",
          label: "Forecasts and segments",
          topics: [
            { id: "bap-m4-t5", type: "Video", title: "Forecasting demand: baselines first", duration: "16 min", completed: false },
            { id: "bap-m4-t6", type: "Reading", title: "Customer segmentation with k-means", duration: "approx. 18 min read", completed: false },
            { id: "bap-m4-t7", type: "Video", title: "Classification for churn: precision, recall and the threshold", duration: "18 min", completed: false },
            { id: "bap-m4-t8", type: "Practice Assignment", title: "Practice Quiz: Models", duration: "approx. 10 min", completed: false },
            { id: "bap-m4-t9", type: "Graded Assignment", title: "Assignment 02 · Demand forecast with a baseline", duration: "approx. 1 h", completed: false },
          ],
        },
      ],
    },
    {
      id: "bap-m5",
      label: "MODULE 05",
      title: "Capstone: From Analysis to Recommendation",
      topicsCompleted: 0,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "bap-m5-l1",
          label: "Capstone project",
          topics: [
            { id: "bap-m5-t1", type: "Reading", title: "Capstone brief: a pricing and retention review", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "bap-m5-t2", type: "Video", title: "Structuring a notebook that others can rerun", duration: "14 min", completed: false, locked: true },
            { id: "bap-m5-t3", type: "Reading", title: "Writing the recommendation: one page for a decision-maker", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "bap-m5-t4", type: "Project", title: "Capstone Project: Pricing and retention review", duration: "approx. 1 h 30 min", completed: false, locked: true },
          ],
        },
        {
          id: "bap-m5-l2",
          label: "Review and wrap-up",
          topics: [
            { id: "bap-m5-t5", type: "Peer Review", title: "Review two capstone notebooks", duration: "approx. 25 min", completed: false, locked: true },
            { id: "bap-m5-t6", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "bap-m5-t7", type: "Video", title: "Where to go next: SQL, dashboards and causal inference", duration: "12 min", completed: false, locked: true },
            { id: "bap-m5-t8", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
