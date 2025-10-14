const modules = [
    {
    title: "Introduction to Data Analytics",
    slides: [
        { 
            title: "What is Data Analytics?", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data analytics is finding insights from data to make decisions.</li>
                <li>It uses tools like Excel, Power BI, Python, and SQL.</li>
                <li>Examples: Sales trends, customer behavior, health patterns.</li>
                <li>It’s about asking questions and finding answers.</li>
                <li>Anyone can learn it with practice!</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data is a puzzle—analytics is how you solve it.”</div>
            </ol></div>` 
        },
        { 
            title: "Why Data Analytics Matters", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Helps businesses make smarter choices.</li>
                <li>Drives efficiency, profit, and innovation.</li>
                <li>Used in finance, healthcare, marketing, and more.</li>
                <li>In Kenya, it powers M-Pesa, agriculture, and startups.</li>
                <li>It’s a skill for the future job market.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data analytics turns raw numbers into real impact.”</div>
            </ol></div>` 
        },
        { 
            title: "The Data Analytics Process", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Step: Ask</strong> - Define the question or problem</li>
                <li><strong>Step: Acquire</strong> - Collect relevant data</li>
                <li><strong>Step: Clean</strong> - Fix errors and missing values</li>
                <li><strong>Step: Explore</strong> - Analyze to find patterns</li>
                <li><strong>Step: Visualize</strong> - Create charts and graphs</li>
                <li><strong>Step: Present</strong> - Share insights with others</li>
                <li>Follow this cycle for every project.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “The analytics process is your map—follow it to find treasure in data.”</div>
            </ol></div>` 
        },
        { 
            title: "Types of Data", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Type: Numerical</strong> - Numbers (e.g., sales, age)</li>
                <li><strong>Type: Categorical</strong> - Groups (e.g., gender, region)</li>
                <li><strong>Type: Time Series</strong> - Data over time (e.g., stock prices)</li>
                <li><strong>Type: Text</strong> - Words or comments (e.g., reviews)</li>
                <li>Understand your data type to choose the right analysis.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data types are your ingredients—know them to cook the right insights.”</div>
            </ol></div>` 
        },
        { 
            title: "Tools for Data Analytics", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Tool: Excel</strong> - Spreadsheets for quick analysis</li>
                <li><strong>Tool: Power BI</strong> - Interactive dashboards</li>
                <li><strong>Tool: Python</strong> - Programming for advanced analytics</li>
                <li><strong>Tool: SQL</strong> - Querying databases</li>
                <li>You’ll learn these tools in this course!</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Tools are your keys—each one unlocks a new way to see data.”</div>
            </ol></div>` 
        },
        { 
            title: "Skills of a Data Analyst", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Curiosity: Ask good questions.</li>
                <li>Technical skills: Use tools like Excel and Python.</li>
                <li>Critical thinking: Spot patterns and errors.</li>
                <li>Communication: Explain insights clearly.</li>
                <li>Problem-solving: Find solutions in data.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “A data analyst is a detective—searching for truth in numbers.”</div>
            </ol></div>` 
        },
        { 
            title: "Data Analytics in Kenya", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Used in mobile money (e.g., M-Pesa analytics).</li>
                <li>Helps agriculture with crop yield predictions.</li>
                <li>Improves healthcare with patient data analysis.</li>
                <li>Startups use it for growth and marketing.</li>
                <li>Growing demand for data skills in Kenya.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “In Kenya, data analytics is a tool for local solutions and global impact.”</div>
            </ol></div>` 
        },
        { 
            title: "Practical: Explore a Dataset", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Find a simple dataset (e.g., sales, weather).</li>
                <li>Look at its columns and data types.</li>
                <li>Write down one question you could ask.</li>
                <li>Share your question with a peer or mentor.</li>
                <li>Start thinking about how to answer it.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every dataset is a story waiting for you to tell it.”</div>
            </ol></div>` 
        },
        { 
            title: "Q&A", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if I’m new to data? → Start with simple tools like Excel.</li>
                <li>What if I don’t know coding? → You’ll learn Python step-by-step.</li>
                <li>What if I don’t have data? → Use free datasets from Kaggle.</li>
                <li>What if it feels hard? → Practice small tasks and ask for help.</li>
                <li>What’s the first step? → Be curious and dive in!</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every analyst starts somewhere—your journey begins with curiosity.”</div>
            </ol></div>` 
        },
        { 
            title: "Key Takeaways", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data analytics turns raw data into insights.</li>
                <li>It’s used in many industries, including in Kenya.</li>
                <li>Follow the analytics process: Ask, Acquire, Clean, Explore, Visualize, Present.</li>
                <li>Learn tools like Excel, Power BI, Python, and SQL.</li>
                <li>You’re ready to start your analytics journey!</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data analytics is your superpower—use it to solve real problems.”</div>
            </ol></div>` 
        },
        { 
            title: "First Analytics Task", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Find a dataset online (e.g., Kaggle, Data.gov).</li>
                <li>Identify its data types (numerical, categorical).</li>
                <li>Write one question you could explore.</li>
                <li>Share your findings with a peer or save them.</li>
                <li>Reflect on what excites you about analytics.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your first task is your first step—take it with confidence.”</div>
            </ol></div>` 
        }
    ]
},
    {
        title: "Data Acquisition",
        slides: [
            { 
                title: "What is Data Acquisition?", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Data acquisition is the process of gathering raw data for analysis.</li>
                    <li>It’s the first step in the data analytics cycle.</li>
                    <li>Data can be collected manually or automatically.</li>
                    <li>Common sources include files, databases, websites, and APIs.</li>
                    <li>Without data, analysis cannot begin.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Before you analyze anything, you need something to analyze—this is where the hunt begins.”</div>
                </ol></div>` 
            },
            { 
                title: "Types of Data", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Structured data: organized in rows and columns (e.g., Excel, SQL).</li>
                    <li>Unstructured data: includes text, images, audio, video.</li>
                    <li>Structured data is easier to analyze and visualize.</li>
                    <li>Unstructured data requires more processing and tools.</li>
                    <li>Most beginner projects use structured data.</li>
                    <li>Even if you have unstructured data the goal is first structure it then continue.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Structured data is like a clean kitchen—everything in its place, ready to cook.”</div>
                </ol></div>` 
            },
            { 
                title: "Finding Data Sources", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>We have Local & Global sources of data.</li>
                    <li>Local sources: surveys, spreadsheets, company systems.</li>
                    <li>Global sources: Kaggle, Data.gov, World Bank, UN datasets.</li>
                    <li>APIs provide live data from websites and apps.</li>
                    <li>Always check data quality and relevance before using.</li>
                    <li>Use open data portals for practice and projects.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Good data is like good ingredients—fresh, clean, and useful makes all the difference.”</div>
                </ol></div>` 
            },
            { 
                title: "Collecting Data with Excel & Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Excel: manually enter or import data from files/web.</li>
                    <li>Power BI: connect to Excel, databases, and online sources.</li>
                    <li>Use Power Query to clean and shape data during import.</li>
                    <li>Combine multiple sources into one report.</li>
                    <li>Great for small businesses and quick analysis.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel and Power BI are your first fishing rods—cast them wisely and reel in insight.”</div>
                </ol></div>` 
            },
            { 
                title: "Web Data & APIs", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Websites often publish data in tables or downloadable files.</li>
                    <li>APIs allow you to pull data automatically using Python.</li>
                    <li>Example: Get COVID-19 stats or weather updates via API.</li>
                    <li>Use Python libraries like requests and json.</li>
                    <li>APIs are powerful for real-time and large-scale data.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “APIs are like secret tunnels—fast, direct, and full of treasure.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing Data into Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Data → Get Data” to import from CSV, Excel, or web.</li>
                    <li>Clean data using filters and formatting tools.</li>
                    <li>Use formulas to check for missing or duplicate values.</li>
                    <li>Save your cleaned version for analysis.</li>
                    <li>Excel is great for beginners and small datasets.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel is your entry point—simple, powerful, and perfect for getting started.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing Data into Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Get Data” to connect to Excel, SQL, web, and more.</li>
                    <li>Power Query Editor helps clean and transform data.</li>
                    <li>Combine multiple sources into one dashboard.</li>
                    <li>Refresh data automatically for live reports.</li>
                    <li>Power BI is ideal for business insights.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI doesn’t just show data—it helps you shape it into something meaningful.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing Data into Python (pandas)", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>import pandas as pd<br>df = pd.read_csv("data.csv")<br>print(df.head())</code></pre></li>
                    <li>Use pandas to load CSV, Excel, JSON, or SQL data.</li>
                    <li>read_csv() is the most common starting point.</li>
                    <li>Preview data with head() and check structure.</li>
                    <li>Python is great for automation and large datasets.</li>
                    <li>You’ll use it often in cleaning and analysis.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Python doesn’t just read data—it helps you tame it, clean it, and make it talk.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing Data into SQL", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use tools like MySQL Workbench or SQLite.</li>
                    <li>Import CSV files into tables using built-in tools.</li>
                    <li>Run queries to explore and filter data.</li>
                    <li>SQL is best for structured, relational data.</li>
                    <li>You’ll learn how to write queries step by step.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “SQL is like asking a librarian for exactly the book you want—fast, precise, and powerful.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Download & Import a Dataset", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Find a dataset from Kaggle or Data.gov.</li>
                    <li>Import it into Excel, Power BI, Python, and SQL.</li>
                    <li>Compare how each tool handles the same data.</li>
                    <li>Note what was easy, what was hard, and what looked best.</li>
                    <li>Save your cleaned version for the next module.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Try each tool like trying on shoes—see which one fits your style and your data.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if I can’t find data? → Use open portals or sample files.</li>
                    <li>What if my file won’t open? → Check format and encoding.</li>
                    <li>What if I don’t understand the data? → Read the column names and documentation.</li>
                    <li>What if I don’t have Power BI? → Use Excel or Google Sheets.</li>
                    <li>What if I’m stuck? → Ask questions and try again.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every question is a step forward—ask boldly, learn deeply.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Data acquisition is the first step in analysis.</li>
                    <li>You can collect data from files, web, APIs, and databases.</li>
                    <li>Excel, Power BI, Python, and SQL all support data import.</li>
                    <li>Clean data starts with smart collection.</li>
                    <li>You’re now ready to clean and prepare your data.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “You’ve gathered your ingredients—next, we clean them and prep for the real cooking.”</div>
                </ol></div>` 
            },
            { 
                title: "Find & Import Data", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a topic you care about (e.g., sports, finance, health).</li>
                    <li>Find a dataset online.</li>
                    <li>Import it into at least two tools.</li>
                    <li>Write down what the data contains and what questions you could ask.</li>
                    <li>Save it for your next project.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Pick a topic you care about—data is more fun when it’s personal.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Data Cleaning & Preparation",
        slides: [
            { 
                title: "Why Clean Data?", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Dirty data leads to wrong answers and bad decisions.</li>
                    <li>Common issues include missing values, duplicates, and incorrect formats.</li>
                    <li>Cleaning ensures accuracy, consistency, and trust.</li>
                    <li>It’s the most time-consuming but critical step in analysis.</li>
                    <li>Clean data = reliable insights.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Messy data is like a cracked mirror—it reflects the truth badly until you fix it.”</div>
                </ol></div>` 
            },
            { 
                title: "Common Data Issues", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Issue: Missing values</strong> - Blank cells in the sales column</li>
                    <li><strong>Issue: Duplicates</strong> - Same customer listed twice</li>
                    <li><strong>Issue: Wrong formats</strong> - “100” stored as text</li>
                    <li><strong>Issue: Typos</strong> - “Nairobbi” instead of “Nairobi”</li>
                    <li><strong>Issue: Mixed types</strong> - Dates stored as text</li>
                    <li>These issues distort analysis and visuals.</li>
                    <li>Always inspect your data before diving into insights.</li>
                    <li>Use filters, summaries, and profiling tools to detect problems.</li>
                    <li>Document what you fix and why.</li>
                    <li>Cleaning is both technical and thoughtful.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Before you analyze, you must sanitize—clean data is the foundation of insight.”</div>
                </ol></div>` 
            },
            { 
                title: "Cleaning Data in Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Remove Duplicates” under the Data tab.</li>
                    <li>Use TRIM, CLEAN, and PROPER to fix messy text.</li>
                    <li>Use filters to find blanks or errors.</li>
                    <li>Use “Text to Columns” to split combined data.</li>
                    <li>Format cells correctly (dates, currency, numbers).</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel is your sponge—scrub the dirt off your data before you serve it.”</div>
                </ol></div>` 
            },
            { 
                title: "Cleaning Data in Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use Power Query to remove errors and blanks.</li>
                    <li>Detect and change incorrect data types.</li>
                    <li>Split, merge, and rename columns.</li>
                    <li>Replace values to fix typos and inconsistencies.</li>
                    <li>Preview and transform data before loading.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI doesn’t just show data—it helps you shape it into something meaningful.”</div>
                </ol></div>` 
            },
            { 
                title: "Cleaning Data with Python (pandas)", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>df.dropna(inplace=True)<br>df['Name'] = df['Name'].str.strip().str.title()<br>df.drop_duplicates(inplace=True)</code></pre></li>
                    <li>Use dropna() to remove rows with missing values.</li>
                    <li>Use string functions to clean text: strip(), lower(), title().</li>
                    <li>Use drop_duplicates() to remove repeated entries.</li>
                    <li>Convert data types using astype() or pd.to_datetime().</li>
                    <li>Python is ideal for cleaning large datasets efficiently.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Cleaning with pandas is like brushing your data’s teeth—fresh, sharp, and ready to smile.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Types & Formatting", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Data types include text, numbers, dates, and booleans.</li>
                    <li>Wrong formats can break formulas and analysis.</li>
                    <li>In Excel: use “Format Cells” to fix types.</li>
                    <li>In Python: use astype() or pd.to_datetime() for conversions.</li>
                    <li>Always check column types before analysis.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Wrong data types are like wrong shoes—uncomfortable and misleading until you fix them.”</div>
                </ol></div>` 
            },
            { 
                title: "Handling Missing Values", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Drop rows or columns with too many blanks.</li>
                    <li>Fill missing values with average, median, or default.</li>
                    <li>Use domain knowledge to decide what to keep.</li>
                    <li>In Python: fillna() helps fill gaps.</li>
                    <li>In Excel: use IF() or filters to flag missing entries.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Missing data isn’t the end—it’s just a question waiting for your judgment.”</div>
                </ol></div>` 
            },
            { 
                title: "Removing Duplicates", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Duplicates can distort totals and averages.</li>
                    <li>In Excel: use “Remove Duplicates” under Data tab.</li>
                    <li>In Python: use drop_duplicates().</li>
                    <li>Always check for hidden duplicates (e.g., same name, different spelling).</li>
                    <li>Document what you remove and why.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Duplicates are echoes—clear them out so your data speaks once.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Validation", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Validation ensures only correct data is entered.</li>
                    <li>In Excel: use “Data Validation” to create dropdowns or rules.</li>
                    <li>Prevents typos and wrong formats.</li>
                    <li>Helps maintain clean inputs for future analysis.</li>
                    <li>Example: restrict entries to valid regions or dates.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Validation is your gatekeeper—only clean data gets through.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Clean a Messy Dataset", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a messy dataset (e.g., customer feedback, sales records).</li>
                    <li>Identify issues: blanks, typos, wrong formats, duplicates.</li>
                    <li>Clean using Excel, Power BI, or Python.</li>
                    <li>Document each step you take.</li>
                    <li>Save the cleaned version for Module 4.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Cleaning data is like prepping ingredients—do it well, and the final dish will shine.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if I delete something by mistake? → Always keep a backup.</li>
                    <li>What if I don’t know what’s wrong with the data? → Use filters and summaries to inspect.</li>
                    <li>What if I can’t fix a value? → Flag it and explain in your report.</li>
                    <li>What if cleaning takes too long? → Focus on the most important columns first.</li>
                    <li>What if I’m unsure? → Ask for help or test different methods.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Cleaning isn’t deleting—it’s deciding what deserves to stay.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Clean data is essential for accurate analysis.</li>
                    <li>Common issues include blanks, typos, duplicates, and wrong formats.</li>
                    <li>Excel, Power BI, and Python offer powerful cleaning tools.</li>
                    <li>Always document your cleaning steps.</li>
                    <li>You’re now ready to explore your data with confidence.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Clean data is like a clear sky—you can finally see what’s really there.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Cleaning Task", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset and clean it using at least two tools.</li>
                    <li>Fix missing values, duplicates, and formatting issues.</li>
                    <li>Write a short summary of what you cleaned and why.</li>
                    <li>Save your cleaned dataset for the next module.</li>
                    <li>Share your process with a peer or mentor.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every cleaned dataset is a story waiting to be told—make yours worth reading.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Exploratory Data Analysis (EDA)",
        slides: [
            { 
                title: "What is EDA?", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>EDA stands for Exploratory Data Analysis.</li>
                    <li>It’s the process of understanding your data before modeling or decision-making.</li>
                    <li>You look for patterns, trends, and relationships.</li>
                    <li>EDA helps you spot errors, outliers, and surprises.</li>
                    <li>It’s where curiosity meets structure.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “EDA is like meeting your data for the first time—listen closely, it has stories to tell.”</div>
                </ol></div>` 
            },
            { 
                title: "Asking the Right Questions", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Start with a clear goal: What do you want to know?</li>
                    <li>Ask questions like: What’s the average? What’s increasing? What’s unusual?</li>
                    <li>Break big questions into smaller ones.</li>
                    <li>Use filters and summaries to test ideas.</li>
                    <li>Let the data guide your next question.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Smart questions lead to smart answers—ask with purpose, explore with patience.”</div>
                </ol></div>` 
            },
            { 
                title: "Descriptive Statistics in Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use AVERAGE, MEDIAN, MODE, MAX, MIN to summarize data.</li>
                    <li>Use COUNT and COUNTA to check volume.</li>
                    <li>Use “Data Analysis Toolpak” for deeper stats.</li>
                    <li>Create summary tables with formulas.</li>
                    <li>Great for quick overviews and comparisons.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel gives you the numbers—your job is to find the meaning behind them.”</div>
                </ol></div>` 
            },
            { 
                title: "Descriptive Statistics in Python", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>df.describe()<br>df['Region'].value_counts()<br>df.groupby('Product')['Sales'].mean()</code></pre></li>
                    <li>describe() gives summary stats for numeric columns.</li>
                    <li>value_counts() shows frequency of categories.</li>
                    <li>groupby() helps compare across groups.</li>
                    <li>Use mean(), sum(), std() for insights.</li>
                    <li>Python is great for large datasets and automation.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Python doesn’t just crunch numbers—it helps you ask better questions.”</div>
                </ol></div>` 
            },
            { 
                title: "Exploring Data in Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use visuals to explore trends and patterns.</li>
                    <li>Use slicers to filter by region, product, or time.</li>
                    <li>Use cards to show key metrics like totals and averages.</li>
                    <li>Use charts to compare categories and time periods.</li>
                    <li>Power BI makes exploration interactive.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI turns exploration into conversation—click, filter, discover.”</div>
                </ol></div>` 
            },
            { 
                title: "Identifying Patterns & Trends", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Look for increases, decreases, and cycles.</li>
                    <li>Compare categories to find leaders and laggards.</li>
                    <li>Use line charts for time trends.</li>
                    <li>Use bar charts for category comparisons.</li>
                    <li>Patterns help you predict and explain.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Trends are footprints—follow them to understand where your data is going.”</div>
                </ol></div>` 
            },
            { 
                title: "Outlier Detection", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Outliers are values that don’t fit the pattern.</li>
                    <li>Use box plots or scatter plots to spot them.</li>
                    <li>In Excel: use conditional formatting to highlight extremes.</li>
                    <li>In Python: use df[df['Sales'] > threshold].</li>
                    <li>Investigate outliers—they may be errors or insights.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Outliers are whispers—sometimes mistakes, sometimes breakthroughs.”</div>
                </ol></div>` 
            },
            { 
                title: "Correlation & Relationships", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Correlation shows how two variables move together.</li>
                    <li>In Excel: use CORREL() function.</li>
                    <li>In Python: use df.corr() for a matrix.</li>
                    <li>Positive correlation: both go up together.</li>
                    <li>Negative correlation: one goes up, the other down.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Correlation is chemistry—see which variables spark together.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Segmentation", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Break data into groups for deeper insight.</li>
                    <li>Segment by region, age, product, or time.</li>
                    <li>Use filters and group functions.</li>
                    <li>Compare segments to find differences.</li>
                    <li>Segmentation helps tailor decisions.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Segmentation is storytelling—each group has its own chapter.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: EDA on a Real Dataset", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a cleaned dataset from Module 3.</li>
                    <li>Use Excel, Power BI, or Python to explore it.</li>
                    <li>Find averages, trends, outliers, and correlations.</li>
                    <li>Segment the data and compare groups.</li>
                    <li>Write down 3 insights you discovered.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Exploration is not just analysis—it’s discovery with direction.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if I don’t see any patterns? → Try segmenting or visualizing differently.</li>
                    <li>What if my data is too small? → Focus on quality, not quantity.</li>
                    <li>What if I find something strange? → Investigate—it could be valuable.</li>
                    <li>What if I don’t know what to ask? → Start with summaries and comparisons.</li>
                    <li>What if I’m overwhelmed? → Focus on one column or question at a time.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Confusion is part of exploration—keep asking, keep learning.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>EDA helps you understand your data before analysis.</li>
                    <li>Ask smart questions and explore with summaries and visuals.</li>
                    <li>Use Excel, Power BI, and Python to uncover patterns.</li>
                    <li>Spot outliers, trends, and relationships.</li>
                    <li>You’re now ready to visualize your findings.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “EDA is the flashlight—shine it on your data and see what’s hidden.”</div>
                </ol></div>` 
            },
            { 
                title: "EDA Report", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset and perform EDA using at least two tools.</li>
                    <li>Summarize key stats, trends, and outliers.</li>
                    <li>Segment the data and compare groups.</li>
                    <li>Write a short report with 3–5 insights.</li>
                    <li>Save it for your portfolio or share with a peer.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your EDA report is your first story—make it clear, curious, and compelling.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Data Visualization",
        slides: [
            { 
                title: "Why Visualize Data?", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Visuals help people understand data faster than tables or text.</li>
                    <li>Charts reveal patterns, trends, and outliers at a glance.</li>
                    <li>Good visuals support decision-making and storytelling.</li>
                    <li>Visualization makes data accessible to non-technical audiences.</li>
                    <li>It’s not just decoration—it’s communication.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data speaks louder when it’s visual—show it, don’t just say it.”</div>
                </ol></div>` 
            },
            { 
                title: "Choosing the Right Chart", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Chart Type: Bar Chart</strong> - Comparing categories</li>
                    <li><strong>Chart Type: Line Chart</strong> - Showing trends over time</li>
                    <li><strong>Chart Type: Pie Chart</strong> - Showing proportions</li>
                    <li><strong>Chart Type: Scatter Plot</strong> - Showing relationships</li>
                    <li><strong>Chart Type: Map Chart</strong> - Showing geographic data</li>
                    <li>Match the chart to the message.</li>
                    <li>Avoid pie charts for too many categories.</li>
                    <li>Use color and labels wisely.</li>
                    <li>Keep it simple and focused.</li>
                    <li>Test different charts to find the best fit.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “The right chart is like the right outfit—it makes your message shine.”</div>
                </ol></div>` 
            },
            { 
                title: "Visualizing in Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Insert → Chart” to create bar, line, pie, and more.</li>
                    <li>Use “Recommended Charts” for quick suggestions.</li>
                    <li>Customize titles, labels, and colors.</li>
                    <li>Use conditional formatting for in-cell visuals.</li>
                    <li>Excel is great for quick, simple charts.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel turns numbers into pictures—fast, familiar, and effective.”</div>
                </ol></div>` 
            },
            { 
                title: "Visualizing in Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Drag fields to create visuals instantly.</li>
                    <li>Use slicers to make charts interactive.</li>
                    <li>Combine visuals into dashboards.</li>
                    <li>Use filters to focus on specific data.</li>
                    <li>Power BI is ideal for business storytelling.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI is your canvas—paint your insights with clarity and control.”</div>
                </ol></div>` 
            },
            { 
                title: "Visualizing in Python", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>import matplotlib.pyplot as plt<br>df['Sales'].plot(kind='bar')<br>plt.title('Sales by Product')<br>plt.show()</code></pre></li>
                    <li>Use matplotlib for basic charts.</li>
                    <li>Use seaborn for advanced, beautiful visuals.</li>
                    <li>Customize colors, labels, and styles.</li>
                    <li>Save charts as images for reports.</li>
                    <li>Python is great for automation and customization.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Python lets you design your visuals—precise, powerful, and programmable.”</div>
                </ol></div>` 
            },
            { 
                title: "Customizing Visuals", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Add clear titles and axis labels.</li>
                    <li>Use color to highlight key points.</li>
                    <li>Avoid clutter—less is more.</li>
                    <li>Use annotations to explain insights.</li>
                    <li>Make visuals readable and professional.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Customization is clarity—make your visuals speak with purpose.”</div>
                </ol></div>` 
            },
            { 
                title: "Telling a Story with Data", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Start with a question or insight.</li>
                    <li>Use visuals to guide the audience step by step.</li>
                    <li>Highlight trends, comparisons, and conclusions.</li>
                    <li>Use captions and commentary to explain.</li>
                    <li>End with a recommendation or action.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Data storytelling turns charts into chapters—make your message unforgettable.”</div>
                </ol></div>` 
            },
            { 
                title: "Dashboards in Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Combine multiple visuals into one view.</li>
                    <li>Use slicers and filters for interactivity.</li>
                    <li>Show key metrics like totals, averages, and trends.</li>
                    <li>Design for clarity and flow.</li>
                    <li>Dashboards help teams monitor performance in real time.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “A dashboard is your data’s résumé—clean, confident, and ready to impress.”</div>
                </ol></div>` 
            },
            { 
                title: "Common Visualization Mistakes", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Too many colors or chart types.</li>
                    <li>Misleading scales or axes.</li>
                    <li>Overuse of pie charts.</li>
                    <li>Cluttered labels and legends.</li>
                    <li>Ignoring the audience’s needs.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “A bad chart is noise—a good chart is music. Make yours sing.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Build a Dashboard", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a cleaned dataset from Module 3.</li>
                    <li>Use Power BI or Excel to build a dashboard.</li>
                    <li>Include at least 3 visuals (e.g., bar chart, line chart, card).</li>
                    <li>Add slicers or filters for interactivity.</li>
                    <li>Save and present your dashboard.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your dashboard is your stage—let your data perform.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if my chart looks messy? → Simplify and remove clutter.</li>
                    <li>What if I don’t know which chart to use? → Try a few and compare.</li>
                    <li>What if my data is too small? → Focus on clarity, not complexity.</li>
                    <li>What if I want to impress my boss? → Use dashboards with clear insights.</li>
                    <li>What if I’m stuck? → Ask for feedback and iterate.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every chart is a draft—refine it until it speaks clearly.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Visualization makes data easier to understand and share.</li>
                    <li>Choose the right chart for your message.</li>
                    <li>Use Excel, Power BI, and Python to create visuals.</li>
                    <li>Customize for clarity and impact.</li>
                    <li>Dashboards help tell stories and drive decisions.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your visuals are your voice—make them bold, clear, and confident.”</div>
                </ol></div>` 
            },
            { 
                title: "Visualization Project", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset and build a dashboard using Power BI or Excel.</li>
                    <li>Include at least 3 types of visuals.</li>
                    <li>Customize titles, labels, and colors.</li>
                    <li>Write a short summary of what your dashboard shows.</li>
                    <li>Save it for your portfolio or present it to a peer.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your dashboard is your signature—make it smart, clean, and unforgettable.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Working with Databases & SQL",
        slides: [
            { 
                title: "What is a Database?", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>A database stores structured data in tables—like Excel, but more powerful.</li>
                    <li>It allows fast access, updates, and organization of large datasets.</li>
                    <li>Common types: MySQL, PostgreSQL, SQLite, Microsoft SQL Server.</li>
                    <li>Used in banking, healthcare, retail, and more.</li>
                    <li>You’ll learn how to interact with databases using SQL.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “A database is your digital warehouse—organized, secure, and ready for action.”</div>
                </ol></div>` 
            },
            { 
                title: "Introduction to SQL", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>SQL stands for Structured Query Language.</li>
                    <li>It’s used to communicate with databases.</li>
                    <li>You write queries to get, filter, and manipulate data.</li>
                    <li>SQL is simple to learn but powerful to use.</li>
                    <li>You’ll start with basic commands and build up.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “SQL is not coding—it’s asking questions in the language of data.”</div>
                </ol></div>` 
            },
            { 
                title: "Connecting to Databases", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use tools like MySQL Workbench, SQLite, or cloud platforms.</li>
                    <li>Connect using credentials: host, username, password, database name.</li>
                    <li>You can also connect through Python or Power BI.</li>
                    <li>Example: Connect to a customer database to analyze purchases.</li>
                    <li>Always test your connection before querying.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Connecting to a database is like unlocking a vault—know the keys, and the data is yours.”</div>
                </ol></div>` 
            },
            { 
                title: "Basic SQL Queries (SELECT, WHERE)", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>SELECT Name, Sales<br>FROM Customers<br>WHERE Region = 'Nairobi';</code></pre></li>
                    <li>SELECT chooses columns.</li>
                    <li>FROM specifies the table.</li>
                    <li>WHERE filters rows based on conditions.</li>
                    <li>Use quotes for text and operators like =, >, <.</li>
                    <li>Start with simple queries to explore your data.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “SELECT is your spotlight—shine it where the answers hide.”</div>
                </ol></div>` 
            },
            { 
                title: "Filtering & Sorting Data", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>SELECT *<br>FROM Sales<br>WHERE Amount > 1000<br>ORDER BY Date DESC;</code></pre></li>
                    <li>Use WHERE to filter rows.</li>
                    <li>Use ORDER BY to sort results.</li>
                    <li>ASC = ascending, DESC = descending.</li>
                    <li>Combine filters for deeper analysis.</li>
                    <li>Example: Find top sales in the last month.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Filtering is like zooming in—focus on what matters most.”</div>
                </ol></div>` 
            },
            { 
                title: "Aggregations (SUM, AVG, COUNT)", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>SELECT Region, SUM(Sales)<br>FROM Orders<br>GROUP BY Region;</code></pre></li>
                    <li>SUM() adds values.</li>
                    <li>AVG() finds the average.</li>
                    <li>COUNT() counts rows.</li>
                    <li>Use GROUP BY to summarize by category.</li>
                    <li>Example: Total sales per region.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Aggregation turns rows into insights—big picture, clear answers.”</div>
                </ol></div>` 
            },
            { 
                title: "Joins & Relationships", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>SELECT Customers.Name, Orders.Amount<br>FROM Customers<br>JOIN Orders ON Customers.ID = Orders.CustomerID;</code></pre></li>
                    <li>Joins combine data from multiple tables.</li>
                    <li>INNER JOIN shows matching rows.</li>
                    <li>LEFT JOIN keeps all from the left table.</li>
                    <li>Relationships are built on shared keys.</li>
                    <li>Example: Match customers with their orders.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Joins are bridges—connect the dots and the story unfolds.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing SQL Data into Power BI/Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Power BI: Use “Get Data → SQL Server” to connect.</li>
                    <li>Excel: Use “Data → From Database” to import.</li>
                    <li>You can refresh data automatically.</li>
                    <li>Use filters and visuals to explore imported data.</li>
                    <li>Great for building dashboards from live databases.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “SQL feeds the dashboard—real-time data, real-time decisions.”</div>
                </ol></div>` 
            },
            { 
                title: "Exporting Data from SQL", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><pre><code>SELECT *<br>INTO ExportTable<br>FROM CleanedData;</code></pre></li>
                    <li>Export data to CSV, Excel, or another table.</li>
                    <li>Use INTO to create new tables.</li>
                    <li>Use tools or scripts to automate exports.</li>
                    <li>Example: Export cleaned customer list for reporting.</li>
                    <li>Always check formats and permissions.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Exporting is packaging—your insights, ready to deliver.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Query a Real Database", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Connect to a sample database (e.g., SQLite or MySQL).</li>
                    <li>Run basic queries: SELECT, WHERE, ORDER BY.</li>
                    <li>Use GROUP BY and JOIN to explore relationships.</li>
                    <li>Import results into Excel or Power BI.</li>
                    <li>Document your queries and findings.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every query is a question—ask wisely, and the data will answer.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if my query doesn’t work? → Check syntax and table names.</li>
                    <li>What if I don’t have a database? → Use free tools like SQLite or sample datasets.</li>
                    <li>What’s the difference between SQL and Excel? → SQL handles bigger, faster data.</li>
                    <li>Can I use SQL with Python? → Yes, with libraries like sqlite3 or SQLAlchemy.</li>
                    <li>How do I practice? → Use online platforms like Mode, W3Schools, or DB Fiddle.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Questions are fuel—ask more, learn faster.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>SQL is the language of databases—simple, powerful, essential.</li>
                    <li>You can filter, sort, and summarize data with ease.</li>
                    <li>Joins unlock deeper insights across tables.</li>
                    <li>SQL connects smoothly to Excel and Power BI.</li>
                    <li>You now have the skills to query real-world data.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “You’ve learned to speak data fluently—SQL is your passport.”</div>
                </ol></div>` 
            },
            { 
                title: "SQL Task", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset with at least two related tables.</li>
                    <li>Write queries to explore, filter, and summarize the data.</li>
                    <li>Use joins to combine insights.</li>
                    <li>Import your results into Power BI or Excel.</li>
                    <li>Share your findings or save for your portfolio.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your challenge is simple: turn raw tables into real answers.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Advanced Excel for Analysts",
        slides: [
            { 
                title: "Advanced Formulas (IF, VLOOKUP, INDEX/MATCH)", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>IF() lets you create logic-based decisions in cells.</li>
                    <li>VLOOKUP() searches for values vertically in a table.</li>
                    <li>INDEX/MATCH is more flexible than VLOOKUP for complex lookups.</li>
                    <li>Combine formulas for multi-step logic.</li>
                    <li>Use named ranges to simplify formulas.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Formulas are your thinking tools—build logic into every cell.”</div>
                </ol></div>` 
            },
            { 
                title: "Pivot Tables", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Pivot Tables summarize large datasets quickly.</li>
                    <li>Drag and drop fields to create dynamic reports.</li>
                    <li>Use filters and slicers to explore data.</li>
                    <li>Group data by categories, dates, or ranges.</li>
                    <li>Great for finding trends and totals fast.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Pivot Tables are your microscope—zoom in and see what matters.”</div>
                </ol></div>` 
            },
            { 
                title: "Conditional Formatting", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Highlight cells based on rules (e.g., greater than, duplicates).</li>
                    <li>Use color scales to show value intensity.</li>
                    <li>Use icon sets for visual indicators.</li>
                    <li>Helps spot trends, errors, and outliers.</li>
                    <li>Make your data speak visually.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Color isn’t decoration—it’s direction. Use it to guide the eye.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Validation & Protection", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use Data Validation to control what users can enter.</li>
                    <li>Create dropdown lists for clean inputs.</li>
                    <li>Prevent duplicates or invalid entries.</li>
                    <li>Protect sheets to lock formulas and structure.</li>
                    <li>Keep your data clean and secure.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Validation is your bouncer—only clean data gets past the door.”</div>
                </ol></div>` 
            },
            { 
                title: "What-If Analysis", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Goal Seek” to find inputs that reach a target.</li>
                    <li>Use “Scenario Manager” to compare different outcomes.</li>
                    <li>Use “Data Tables” to test multiple values.</li>
                    <li>Great for forecasting and decision-making.</li>
                    <li>Helps answer “what happens if…?”</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “What-if tools turn questions into simulations—test before you act.”</div>
                </ol></div>` 
            },
            { 
                title: "Macros & Automation", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Macros record steps to automate tasks.</li>
                    <li>Use the Developer tab to access macro tools.</li>
                    <li>Write simple VBA code for custom automation.</li>
                    <li>Save time on repetitive tasks.</li>
                    <li>Always test macros before sharing.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Macros are your robot assistants—teach them once, and they’ll never forget.”</div>
                </ol></div>` 
            },
            { 
                title: "Connecting Excel to Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Export Excel tables into Power BI for visualization.</li>
                    <li>Use Power Query in both tools for cleaning and shaping.</li>
                    <li>Refresh data automatically from Excel sources.</li>
                    <li>Combine Excel logic with Power BI visuals.</li>
                    <li>Great for building hybrid dashboards.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel and Power BI are teammates—connect them and amplify your insights.”</div>
                </ol></div>` 
            },
            { 
                title: "Importing Data from Web", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Data → From Web” to pull online tables into Excel.</li>
                    <li>Clean and format web data using Power Query.</li>
                    <li>Great for live updates from public sources.</li>
                    <li>Watch for inconsistent formatting or broken links.</li>
                    <li>Use responsibly and cite your sources.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “The web is a buffet—Excel helps you plate the data you need.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Modeling in Excel", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use relationships between tables with Power Pivot.</li>
                    <li>Create calculated columns and measures using DAX.</li>
                    <li>Build models that update with new data.</li>
                    <li>Use slicers and timelines for interactivity.</li>
                    <li>Excel can handle complex models with the right setup.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Modeling is storytelling with structure—build it once, and let it evolve.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Advanced Excel Project", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Use a dataset to build a dashboard with Pivot Tables, formulas, and conditional formatting.</li>
                    <li>Add dropdowns and validation for clean inputs.</li>
                    <li>Use Goal Seek or Scenario Manager for forecasting.</li>
                    <li>Automate one task with a macro.</li>
                    <li>Save and present your workbook.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your workbook is your workshop—build tools that work for you.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if my formula doesn’t work? → Check syntax and cell references.</li>
                    <li>What if my Pivot Table is blank? → Check your source data and filters.</li>
                    <li>What if I break a macro? → Undo or restore a backup.</li>
                    <li>What if I don’t see Power Pivot? → Enable it in Excel options.</li>
                    <li>What if I’m overwhelmed? → Start with one feature at a time.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel is deep—dive in slowly, and you’ll swim like a pro.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Advanced Excel features help you analyze, automate, and model data.</li>
                    <li>Use formulas, Pivot Tables, and conditional formatting for insight.</li>
                    <li>Use validation and protection to keep data clean.</li>
                    <li>Automate tasks with macros and connect to Power BI.</li>
                    <li>You’re now ready to build powerful Excel projects.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Excel isn’t just a spreadsheet—it’s your analytical playground.”</div>
                </ol></div>` 
            },
            { 
                title: "Excel Mini-Project", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset and build a mini-project using at least 3 advanced features.</li>
                    <li>Include formulas, visuals, and automation.</li>
                    <li>Write a short summary of what your workbook does.</li>
                    <li>Save it for your portfolio or present it to a peer.</li>
                    <li>Reflect on what you learned.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your Excel project is your proof—show what you’ve built, and how it works.”</div>
                </ol></div>` 
            }
        ]
    },
    {
        title: "Power BI for Business Insights",
        slides: [
            { 
                title: "Power BI Overview", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Power BI is a business intelligence tool for data visualization and reporting.</li>
                    <li>It connects to multiple data sources and transforms raw data into insights.</li>
                    <li>You can build interactive dashboards and share them online.</li>
                    <li>It’s used by companies for performance tracking and decision-making.</li>
                    <li>Power BI has a desktop app and a cloud service.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI turns data into decisions—fast, visual, and impactful.”</div>
                </ol></div>` 
            },
            { 
                title: "Connecting to Multiple Data Sources", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use “Get Data” to connect to Excel, SQL, web, and cloud sources.</li>
                    <li>Combine data from different systems into one report.</li>
                    <li>Use Power Query to clean and shape data during import.</li>
                    <li>Refresh data automatically for live updates.</li>
                    <li>Great for building unified dashboards.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI is your data hub—connect everything, see everything.”</div>
                </ol></div>` 
            },
            { 
                title: "Data Modeling in Power BI", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Use relationships to connect tables (like SQL joins).</li>
                    <li>Create calculated columns and measures using DAX.</li>
                    <li>Build models that update with new data.</li>
                    <li>Use “Manage Relationships” to define links.</li>
                    <li>Modeling helps you analyze complex datasets.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Modeling is structure—build it right, and your insights will stand strong.”</div>
                </ol></div>` 
            },
            { 
                title: "Creating Interactive Dashboards", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Drag visuals onto the canvas to build your dashboard.</li>
                    <li>Use slicers and filters for interactivity.</li>
                    <li>Add cards to show totals, averages, and KPIs.</li>
                    <li>Use themes and layout tools for design.</li>
                    <li>Dashboards help users explore data on their own.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “A dashboard is your data’s voice—make it speak clearly and confidently.”</div>
                </ol></div>` 
            },
            { 
                title: "DAX Basics", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>DAX stands for Data Analysis Expressions.</li>
                    <li>It’s used to create formulas in Power BI.</li>
                    <li>Example: TotalSales = SUM(Sales[Amount])</li>
                    <li>Use DAX for calculated columns, measures, and filters.</li>
                    <li>DAX is powerful for custom logic and analysis.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “DAX is your formula language—speak it fluently, and your data will listen.”</div>
                </ol></div>` 
            },
            { 
                title: "Filters & Slicers", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Filters narrow down data in visuals or pages.</li>
                    <li>Slicers let users interact with dashboards.</li>
                    <li>Use dropdowns, buttons, or timelines.</li>
                    <li>Combine multiple slicers for deeper control.</li>
                    <li>Filters help focus the story.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Slicers are your steering wheel—let users drive their own insights.”</div>
                </ol></div>` 
            },
            { 
                title: "Sharing Reports", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Publish dashboards to Power BI Service.</li>
                    <li>Share with teams or clients via links or apps.</li>
                    <li>Set permissions for viewing or editing.</li>
                    <li>Schedule data refreshes for up-to-date reports.</li>
                    <li>Collaborate in real time across devices.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Insights are meant to be shared—Power BI makes it seamless.”</div>
                </ol></div>` 
            },
            { 
                title: "Power BI Service & Cloud", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Power BI Service is the online platform for sharing and collaboration.</li>
                    <li>Access dashboards from any device.</li>
                    <li>Use workspaces to organize reports.</li>
                    <li>Set alerts and subscriptions for key metrics.</li>
                    <li>Cloud access means real-time decisions.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “The cloud is your command center—watch your data, lead your team.”</div>
                </ol></div>` 
            },
            { 
                title: "Real-World Use Cases", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Industry: Retail</strong> - Track sales and inventory</li>
                    <li><strong>Industry: Finance</strong> - Monitor budgets and forecasts</li>
                    <li><strong>Industry: Healthcare</strong> - Analyze patient outcomes</li>
                    <li><strong>Industry: Education</strong> - Visualize student performance</li>
                    <li><strong>Industry: Logistics</strong> - Optimize delivery routes</li>
                    <li>Power BI is used across industries.</li>
                    <li>Dashboards help teams stay informed and aligned.</li>
                    <li>You’ll build your own use case in the practical task.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI isn’t just a tool—it’s a translator between data and decisions.”</div>
                </ol></div>` 
            },
            { 
                title: "Practical: Build a Business Dashboard", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a dataset related to business (e.g., sales, finance, operations).</li>
                    <li>Connect it to Power BI and clean the data.</li>
                    <li>Build a dashboard with at least 3 visuals.</li>
                    <li>Add slicers and cards for interactivity.</li>
                    <li>Save and present your dashboard.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your dashboard is your business pitch—make it smart, visual, and convincing.”</div>
                </ol></div>` 
            },
            { 
                title: "Q&A", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>What if my visuals don’t show data? → Check relationships and filters.</li>
                    <li>What if I don’t understand DAX? → Start with simple formulas and build up.</li>
                    <li>What if my dashboard looks messy? → Use themes and layout tools.</li>
                    <li>What if I can’t publish? → Check your Power BI account and permissions.</li>
                    <li>What if I’m stuck? → Ask for help or explore Power BI tutorials.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every dashboard starts rough—refine it until it tells a story.”</div>
                </ol></div>` 
            },
            { 
                title: "Key Takeaways", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li>Power BI helps you turn data into business insights.</li>
                    <li>Connect multiple sources and model your data.</li>
                    <li>Build interactive dashboards with visuals and slicers.</li>
                    <li>Use DAX for custom logic and analysis.</li>
                    <li>Share your work through Power BI Service.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Power BI is your business lens—look through it, and lead with clarity.”</div>
                </ol></div>` 
            },
            { 
                title: "Power BI Project", 
                content: `<div class="ai-slide-block"><ol class='highlight-list'>
                    <li><strong>Task:</strong></li>
                    <li>Choose a business dataset and build a dashboard in Power BI.</li>
                    <li>Include at least 3 visuals, 2 slicers, and 1 DAX measure.</li>
                    <li>Write a short summary of what your dashboard shows.</li>
                    <li>Share it with a peer or save it for your portfolio.</li>
                    <li>Reflect on what you learned.</li>
                    <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your Power BI project is your proof—show how data drives decisions.”</div>
                </ol></div>` 
            }
        ]
    },
    
    
{
    title: "Python for Data Analysis",
    slides: [
        { 
            title: "Why Python for Data?", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Python is a flexible, beginner-friendly programming language.</li>
                <li>It’s widely used in data science, machine learning, and automation.</li>
                <li>Python handles large datasets better than Excel.</li>
                <li>It has powerful libraries like pandas, matplotlib, and seaborn.</li>
                <li>You’ll use Python for cleaning, analysis, and visualization.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Python is your digital scalpel—precise, powerful, and ready to dissect data.”</div>
            </ol></div>` 
        },
        { 
            title: "Setting Up Python & Jupyter", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Install Python from python.org or use Anaconda.</li>
                <li>Use Jupyter Notebook for writing and running code interactively.</li>
                <li>Install libraries using <code>pip install pandas matplotlib seaborn</code>.</li>
                <li>Notebooks let you mix code, notes, and visuals.</li>
                <li>Great for learning, experimenting, and sharing.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Jupyter is your lab—code, test, and learn in one place.”</div>
            </ol></div>` 
        },
        { 
            title: "Data Structures (lists, dicts, DataFrames)", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>list:</strong> ordered collection of items.</li>
                <li><strong>dict:</strong> key-value pairs for structured data.</li>
                <li><strong>DataFrame:</strong> table-like structure from pandas.</li>
                <li>Use <code>df.head()</code> to preview data.</li>
                <li>DataFrames are the heart of Python data analysis.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “DataFrames are your spreadsheet in code—flexible, fast, and full of insight.”</div>
            </ol></div>` 
        },
        { 
            title: "Importing Data with pandas", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><pre><code>import pandas as pd
df = pd.read_csv("data.csv")
df.head()</code></pre></li>
                <li>Use <code>read_csv()</code> to load CSV files.</li>
                <li>Use <code>read_excel()</code> for Excel files.</li>
                <li>Preview data with <code>head()</code> and <code>info()</code>.</li>
                <li>Check for missing values with <code>isnull().sum()</code>.</li>
                <li>pandas makes importing fast and easy.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Importing is your handshake with the data—start clean, start smart.”</div>
            </ol></div>` 
        },
        { 
            title: "Data Cleaning in pandas", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><pre><code>df.dropna(inplace=True)
df['Name'] = df['Name'].str.strip().str.title()
df.drop_duplicates(inplace=True)</code></pre></li>
                <li>Use <code>dropna()</code> to remove missing values.</li>
                <li>Use string functions to clean text.</li>
                <li>Use <code>drop_duplicates()</code> to remove repeats.</li>
                <li>Convert data types with <code>astype()</code> or <code>to_datetime()</code>.</li>
                <li>Document your cleaning steps.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Cleaning with pandas is like brushing your data’s teeth—fresh, sharp, and ready to smile.”</div>
            </ol></div>` 
        },
        { 
            title: "Exploratory Analysis in pandas", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><pre><code>df.describe()
df['Region'].value_counts()
df.groupby('Product')['Sales'].mean()</code></pre></li>
                <li>Use <code>describe()</code> for summary stats.</li>
                <li>Use <code>value_counts()</code> for category frequency.</li>
                <li>Use <code>groupby()</code> for comparisons.</li>
                <li>Spot trends, outliers, and patterns.</li>
                <li>EDA helps you understand your data deeply.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Exploration is curiosity in action—ask, group, and discover.”</div>
            </ol></div>` 
        },
        { 
            title: "Visualization with matplotlib/seaborn", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><pre><code>import matplotlib.pyplot as plt
import seaborn as sns
sns.barplot(x='Product', y='Sales', data=df)</code></pre></li>
                <li>Use matplotlib for basic charts.</li>
                <li>Use seaborn for advanced visuals.</li>
                <li>Create bar, line, scatter, and box plots.</li>
                <li>Customize titles, labels, and colors.</li>
                <li>Save charts as images for reports.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Visuals in Python are your spotlight—shine it where the insight lives.”</div>
            </ol></div>` 
        },
        { 
            title: "Automating Data Tasks", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Use loops to repeat tasks across rows or files.</li>
                <li>Use functions to reuse code.</li>
                <li>Automate cleaning, analysis, and reporting.</li>
                <li>Schedule scripts to run daily or weekly.</li>
                <li>Python saves time and reduces errors.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Automation is your time-saver—teach the machine once, and let it run.”</div>
            </ol></div>` 
        },
        { 
            title: "Exporting Results", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><pre><code>df.to_csv("cleaned_data.csv", index=False)</code></pre></li>
                <li>Use <code>to_csv()</code> to save cleaned data.</li>
                <li>Use <code>to_excel()</code> for Excel output.</li>
                <li>Export charts using <code>plt.savefig()</code>.</li>
                <li>Share results with teams or tools.</li>
                <li>Always label and organize your exports.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Exporting is packaging—your insights, ready to deliver.”</div>
            </ol></div>` 
        },
        { 
            title: "Practical: Python Data Project", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and import it using pandas.</li>
                <li>Clean the data and perform EDA.</li>
                <li>Create at least 2 charts using matplotlib or seaborn.</li>
                <li>Export your cleaned data and visuals.</li>
                <li>Save your notebook and share your findings.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your notebook is your narrative—code, clean, and communicate.”</div>
            </ol></div>` 
        },
        { 
            title: "Q&A", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if I get an error? → Read the message and check your syntax.</li>
                <li>What if I don’t know Python? → Start with small steps and practice.</li>
                <li>What if my chart looks wrong? → Check your data and labels.</li>
                <li>What if I forget a command? → Use documentation or search online.</li>
                <li>What if I’m stuck? → Ask for help or copy working examples.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Every bug is a lesson—debug, learn, and grow.”</div>
            </ol></div>` 
        },
        { 
            title: "Key Takeaways", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Python is powerful for data analysis and automation.</li>
                <li>Use pandas for importing, cleaning, and exploring data.</li>
                <li>Use matplotlib and seaborn for visualization.</li>
                <li>Automate tasks and export results efficiently.</li>
                <li>You’re now ready to present your analysis.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Python is your analytical engine—fuel it with data, drive it with logic.”</div>
            </ol></div>` 
        },
        { 
            title: "Python Mini-Project", 
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and complete a mini-project in Python.</li>
                <li>Clean the data, perform EDA, and create visuals.</li>
                <li>Export your results and write a short summary.</li>
                <li>Save your notebook for your portfolio.</li>
                <li>Reflect on what you learned.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> “Your Python project is your proof—show what you’ve built, and how it works.”</div>
            </ol></div>` 
        }
    ]
},

    
{
    title: "From Analysis to Presentation",
    slides: [
        {
            title: "Structuring Your Findings",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Start with a clear question and summary of your analysis.</li>
                <li>Organize insights into themes or categories.</li>
                <li>Use bullet points, visuals, and summaries.</li>
                <li>Highlight key metrics and trends.</li>
                <li>End with recommendations or next steps.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Structure turns data into a message—build it like a bridge, strong and clear.</div>
            </ol></div>`
        },
        {
            title: "Building a Compelling Story",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Use the “Data → Insight → Action” flow.</li>
                <li>Introduce the problem, show the evidence, and suggest solutions.</li>
                <li>Keep it simple, logical, and engaging.</li>
                <li>Use real-world examples to connect with your audience.</li>
                <li>Every chart should support your story.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Data storytelling is persuasion with proof—make your case with clarity.</div>
            </ol></div>`
        },
        {
            title: "Creating Effective Slides",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Use clean layouts with minimal text.</li>
                <li>Highlight one insight per slide.</li>
                <li>Use visuals instead of tables when possible.</li>
                <li>Choose readable fonts and consistent colors.</li>
                <li>Practice slide flow and transitions.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Slides are your stage—design them to spotlight your message.</div>
            </ol></div>`
        },
        {
            title: "Presenting with Confidence",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Know your content—practice until it feels natural.</li>
                <li>Speak clearly and make eye contact.</li>
                <li>Use pauses to emphasize key points.</li>
                <li>Handle nerves with deep breaths and preparation.</li>
                <li>Confidence comes from clarity and practice.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Confidence isn’t loud—it’s clear, calm, and ready.</div>
            </ol></div>`
        },
        {
            title: "Data-Driven Decision Making",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Use insights to support business or policy decisions.</li>
                <li>Show how your findings solve real problems.</li>
                <li>Link data to goals, KPIs, or outcomes.</li>
                <li>Use “if-then” logic to guide action.</li>
                <li>Decision-makers want clarity, not complexity.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Data is your compass—use it to guide smart decisions.</div>
            </ol></div>`
        },
        {
            title: "Executive Summaries",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Summarize your findings in one page or slide.</li>
                <li>Include the question, key insights, and recommendations.</li>
                <li>Use bullet points and visuals for quick reading.</li>
                <li>Tailor language for non-technical audiences.</li>
                <li>Executive summaries help leaders act fast.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Executives don’t need the whole story—just the headline and the punchline.</div>
            </ol></div>`
        },
        {
            title: "Presenting to Non-Technical Audiences",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Avoid jargon—use plain language.</li>
                <li>Focus on impact, not process.</li>
                <li>Use analogies or examples to explain concepts.</li>
                <li>Highlight what matters to the audience.</li>
                <li>Keep visuals simple and intuitive.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Speak human, not machine—make your insights relatable.</div>
            </ol></div>`
        },
        {
            title: "Handling Questions",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Listen fully before answering.</li>
                <li>Repeat the question to clarify.</li>
                <li>Use data to support your response.</li>
                <li>Admit when you don’t know—offer to follow up.</li>
                <li>Stay calm and respectful.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Questions aren’t attacks—they’re invitations to explain.</div>
            </ol></div>`
        },
        {
            title: "Portfolio Building",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Save your best projects and presentations.</li>
                <li>Include visuals, summaries, and code (if applicable).</li>
                <li>Use GitHub, LinkedIn, or a personal website.</li>
                <li>Update regularly with new work.</li>
                <li>Your portfolio is your professional showcase.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your portfolio is your passport—stamp it with every skill you earn.</div>
            </ol></div>`
        },
        {
            title: "Practical: Present Your Analysis",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a completed project from a previous module.</li>
                <li>Create a 5-slide presentation with visuals and insights.</li>
                <li>Include an executive summary and recommendations.</li>
                <li>Present to a peer or mentor and get feedback.</li>
                <li>Save your slides for your portfolio.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your presentation is your spotlight—step up and shine.</div>
            </ol></div>`
        },
        {
            title: "Q&A",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if I’m nervous? → Practice and breathe—confidence grows with repetition.</li>
                <li>What if I get a tough question? → Stay calm, clarify, and respond with logic.</li>
                <li>What if my slides are too long? → Trim to essentials—less is more.</li>
                <li>What if I forget something? → Keep notes or cue cards.</li>
                <li>What if I’m presenting online? → Test your tech and engage visually.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Every presenter starts unsure—practice turns nerves into power.</div>
            </ol></div>`
        },
        {
            title: "Key Takeaways",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Structure your findings into a clear, compelling story.</li>
                <li>Use visuals and summaries to communicate effectively.</li>
                <li>Present with confidence and clarity.</li>
                <li>Tailor your message to your audience.</li>
                <li>Your analysis deserves to be seen and understood.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Insight is only powerful when it’s shared—present like it matters.</div>
            </ol></div>`
        },
        {
            title: "Presentation Task",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and complete a full analysis.</li>
                <li>Create a 5-slide presentation with visuals, insights, and recommendations.</li>
                <li>Include an executive summary and prepare to present.</li>
                <li>Record or deliver your presentation to a peer.</li>
                <li>Reflect on what you learned and improve your slides.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your challenge is to speak insight—make your data heard.</div>
            </ol></div>`
        }
    ]
},
{
    title: "AI & Data Analytics",
    slides: [
        {
            title: "What is AI in Data Analytics?",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI refers to machines that mimic human intelligence—learning, reasoning, and decision-making.</li>
                <li>In data analytics, AI helps automate tasks and uncover patterns.</li>
                <li>It includes machine learning, natural language processing, and computer vision.</li>
                <li>AI can analyze large datasets faster than humans.</li>
                <li>It’s transforming industries and workflows.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI doesn’t replace analysts—it empowers them to think bigger and faster.</div>
            </ol></div>`
        },
        {
            title: "AI Tools for Analysts",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>ChatGPT helps generate summaries, explanations, and code.</li>
                <li>Microsoft Copilot assists with Excel, Power BI, and presentations.</li>
                <li>AI tools can clean data, suggest visuals, and write queries.</li>
                <li>They save time and reduce manual effort.</li>
                <li>Analysts must guide AI with clear instructions.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI is your assistant—not your replacement. Use it wisely, lead it boldly.</div>
            </ol></div>`
        },
        {
            title: "Automating Data Cleaning with AI",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI can detect missing values, duplicates, and outliers.</li>
                <li>Tools like OpenRefine and Python libraries use AI to clean data.</li>
                <li>AI learns patterns and applies fixes across datasets.</li>
                <li>Reduces human error and speeds up preparation.</li>
                <li>Analysts still need to review and validate results.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Let AI sweep the floor—but you decide what stays and what goes.</div>
            </ol></div>`
        },
        {
            title: "AI for Data Visualization",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI can suggest the best chart for your data.</li>
                <li>Tools like Power BI and Tableau use AI to auto-generate visuals.</li>
                <li>AI can detect trends and highlight insights.</li>
                <li>Some platforms offer natural language queries for visuals.</li>
                <li>Helps non-technical users explore data easily.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI turns data into pictures—fast, smart, and surprisingly beautiful.</div>
            </ol></div>`
        },
        {
            title: "Predictive Analytics Basics",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Predictive analytics uses historical data to forecast future outcomes.</li>
                <li>AI models learn patterns and make predictions.</li>
                <li>Common techniques: regression, classification, clustering.</li>
                <li>Used in finance, health, marketing, and logistics.</li>
                <li>Requires clean data and careful model selection.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Prediction isn’t magic—it’s math, memory, and machine learning.</div>
            </ol></div>`
        },
        {
            title: "Ethics in AI & Data",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI must be fair, transparent, and accountable.</li>
                <li>Bias in data leads to unfair outcomes.</li>
                <li>Analysts must check for discrimination and misuse.</li>
                <li>Privacy and consent are critical.</li>
                <li>Ethical AI builds trust and protects people.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Smart analysis is ethical analysis—data without conscience is dangerous.</div>
            </ol></div>`
        },
        {
            title: "AI in Excel, Power BI, Python",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Excel: Copilot suggests formulas and summaries.</li>
                <li>Power BI: AI visuals and natural language queries.</li>
                <li>Python: AI libraries like scikit-learn, TensorFlow, and transformers.</li>
                <li>AI enhances each tool’s capabilities.</li>
                <li>Learn to integrate AI into your workflow.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI is the upgrade—your tools just got smarter.</div>
            </ol></div>`
        },
        {
            title: "Real-World AI Use Cases",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Sector – AI Application</strong></li>
                <li>Healthcare – Predicting patient risk</li>
                <li>Retail – Personalizing product recommendations</li>
                <li>Finance – Fraud detection and credit scoring</li>
                <li>Agriculture – Crop yield forecasting</li>
                <li>Education – Adaptive learning and grading</li>
                <li>AI is reshaping industries.</li>
                <li>Analysts help design and interpret AI systems.</li>
                <li>Use cases show the power and responsibility of AI.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI is everywhere—your job is to make it meaningful.</div>
            </ol></div>`
        },
        {
            title: "Limitations of AI",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI depends on the quality of data.</li>
                <li>It can’t understand context or emotion like humans.</li>
                <li>Models may be biased or inaccurate.</li>
                <li>Over-reliance can lead to blind decisions.</li>
                <li>Analysts must combine AI with human judgment.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI is smart—but not wise. That’s your role.</div>
            </ol></div>`
        },
        {
            title: "Practical: Use AI in a Data Task",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and use AI to clean, analyze, or visualize it.</li>
                <li>Try tools like ChatGPT, Copilot, or Python libraries.</li>
                <li>Document what AI did and what you reviewed manually.</li>
                <li>Reflect on how AI helped or hindered your process.</li>
                <li>Share your findings with a peer.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Let AI assist—but make sure your fingerprints are on the final product.</div>
            </ol></div>`
        },
        {
            title: "Q&A",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if AI gives wrong results? → Review and validate manually.</li>
                <li>What if I don’t understand the model? → Focus on inputs and outputs first.</li>
                <li>What if AI feels too complex? → Start with simple tools like Copilot or ChatGPT.</li>
                <li>What if I’m worried about bias? → Check your data and test fairness.</li>
                <li>What if I want to learn more? → Explore AI ethics, machine learning, and automation.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI is a tool—not a truth. Use it with care, and question everything.</div>
            </ol></div>`
        },
        {
            title: "Key Takeaways",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>AI enhances data analysis through automation and prediction.</li>
                <li>Tools like ChatGPT, Copilot, and Python libraries support analysts.</li>
                <li>Ethics and validation are critical in AI use.</li>
                <li>AI is powerful—but needs human guidance.</li>
                <li>You’re now equipped to use AI responsibly.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> AI gives you speed—your wisdom gives it direction.</div>
            </ol></div>`
        },
        {
            title: "AI-Enhanced Analysis",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and complete an analysis using AI tools.</li>
                <li>Use AI for cleaning, visualization, or prediction.</li>
                <li>Document your process and reflect on AI’s role.</li>
                <li>Share your project and insights.</li>
                <li>Save it for your portfolio.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your challenge is to lead the machine—don’t just use AI, guide it.</div>
            </ol></div>`
        }
    ]
},
{
    title: "Trends & The Future of Data Analytics",
    slides: [
        {
            title: "The Evolving Data Landscape",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data is growing exponentially—volume, variety, and velocity.</li>
                <li>New sources include IoT, social media, and real-time sensors.</li>
                <li>Analysts must adapt to faster, more complex data environments.</li>
                <li>Cloud platforms and AI are reshaping workflows.</li>
                <li>The future is real-time, predictive, and automated.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Data never sleeps—stay curious, stay current.</div>
            </ol></div>`
        },
        {
            title: "Big Data & Cloud Analytics",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Big Data refers to massive datasets that traditional tools can’t handle.</li>
                <li>Cloud platforms like Azure, AWS, and Google Cloud offer scalable solutions.</li>
                <li>Analysts use cloud tools for storage, processing, and collaboration.</li>
                <li>Cloud analytics enables remote access and real-time updates.</li>
                <li>Learn to work with cloud-based data pipelines.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> The cloud is your playground—big data, big possibilities.</div>
            </ol></div>`
        },
        {
            title: "Data Science vs. Data Analytics",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Role:</strong> Data Analyst – Descriptive & diagnostic analysis</li>
                <li><strong>Role:</strong> Data Scientist – Predictive & prescriptive modeling</li>
                <li>Analysts explain what happened and why.</li>
                <li>Scientists predict what will happen and how to optimize it.</li>
                <li>Both roles require strong data skills.</li>
                <li>Analysts often transition into data science.</li>
                <li>Choose your path based on interest and goals.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Analytics tells the story—data science writes the sequel.</div>
            </ol></div>`
        },
        {
            title: "Data Engineering Basics",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data engineers build systems to collect, store, and move data.</li>
                <li>They design pipelines and manage databases.</li>
                <li>Tools include SQL, Python, Spark, and cloud platforms.</li>
                <li>Analysts often work with engineers to access clean data.</li>
                <li>Understanding engineering helps analysts collaborate better.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Engineers build the roads—analysts drive the insights.</div>
            </ol></div>`
        },
        {
            title: "Data Analytics in Kenya & Africa",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Governments use data for planning, budgeting, and service delivery.</li>
                <li>Businesses use analytics for customer insights and growth.</li>
                <li>NGOs use data to measure impact and allocate resources.</li>
                <li>Mobile money and agriculture are key data-rich sectors.</li>
                <li>Africa’s data future is local, innovative, and community-driven.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Kenya’s data story is rising—be part of the movement.</div>
            </ol></div>`
        },
        {
            title: "Industry Trends (Finance, Health, etc.)",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Sector:</strong> Finance – Real-time fraud detection</li>
                <li><strong>Sector:</strong> Health – Predictive patient care</li>
                <li><strong>Sector:</strong> Retail – Personalized marketing</li>
                <li><strong>Sector:</strong> Education – Learning analytics</li>
                <li><strong>Sector:</strong> Agriculture – Smart farming with sensors</li>
                <li>Each industry uses data differently.</li>
                <li>Analysts must understand domain-specific needs.</li>
                <li>Trends include automation, personalization, and prediction.</li>
                <li>Stay updated through blogs, webinars, and reports.</li>
                <li>Choose a sector that aligns with your passion.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Every industry speaks data—learn its dialect, lead its future.</div>
            </ol></div>`
        },
        {
            title: "Data Privacy & Security",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data must be protected from misuse and breaches.</li>
                <li>Privacy laws like GDPR and Kenya’s Data Protection Act matter.</li>
                <li>Analysts must handle sensitive data responsibly.</li>
                <li>Use encryption, access controls, and anonymization.</li>
                <li>Ethics and security go hand in hand.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Trust is built on privacy—protect the data, protect the people.</div>
            </ol></div>`
        },
        {
            title: "Open Data & Collaboration",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Open data is free, public, and reusable.</li>
                <li>Governments and NGOs publish datasets for transparency.</li>
                <li>Collaboration leads to innovation and shared solutions.</li>
                <li>Use platforms like Kenya Open Data and World Bank.</li>
                <li>Open data empowers communities and drives change.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Open data is open opportunity—share, learn, and build together.</div>
            </ol></div>`
        },
        {
            title: "Building a Career in Analytics",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Start with strong foundations in tools and thinking.</li>
                <li>Build a portfolio with real projects.</li>
                <li>Network through meetups, LinkedIn, and online forums.</li>
                <li>Stay updated with certifications and courses.</li>
                <li>Choose a niche and grow your expertise.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your career is a journey—every dataset is a step forward.</div>
            </ol></div>`
        },
        {
            title: "Practical: Research a Trend",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a trend in data analytics (e.g., AI, cloud, open data).</li>
                <li>Research how it’s used in Kenya or globally.</li>
                <li>Write a short summary with examples and impact.</li>
                <li>Share your findings with the class or mentor.</li>
                <li>Reflect on how this trend affects your future.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Trends are signals—follow them to shape your path.</div>
            </ol></div>`
        },
        {
            title: "Q&A",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if I don’t know which trend to follow? → Explore and experiment.</li>
                <li>What if I’m worried about automation? → Focus on skills that AI can’t replace.</li>
                <li>What if I want to work in Kenya? → Learn local tools, laws, and needs.</li>
                <li>What if I’m interested in multiple sectors? → Start broad, then specialize.</li>
                <li>What if I feel behind? → The future is still being written—start now.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> The future isn’t fixed—it’s yours to shape.</div>
            </ol></div>`
        },
        {
            title: "Key Takeaways",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Data analytics is evolving with AI, cloud, and big data.</li>
                <li>Analysts must adapt to new tools and trends.</li>
                <li>Kenya and Africa offer unique opportunities.</li>
                <li>Ethics, privacy, and collaboration matter.</li>
                <li>You’re ready to build a future-proof career.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> You’re not just learning data—you’re learning to lead with it.</div>
            </ol></div>`
        },
        {
            title: "Future-Proof Your Skills",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose one trend and one skill to focus on next.</li>
                <li>Create a 30-day learning plan with resources and goals.</li>
                <li>Join a community or attend a webinar.</li>
                <li>Reflect on how this will grow your career.</li>
                <li>Share your plan with a peer or mentor.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your challenge is to grow forward—learn what lasts, lead what’s next.</div>
            </ol></div>`
        }
    ]
},
{
    title: "Capstone Project & Graduation",
    slides: [
        {
            title: "What is a Capstone Project?",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>A capstone is your final, full-scale project that brings together all modules.</li>
                <li>It simulates a real-world data analysis task.</li>
                <li>You’ll choose a dataset, define a question, and present insights.</li>
                <li>It shows your skills in acquisition, cleaning, analysis, visualization, and presentation.</li>
                <li>It’s your portfolio centerpiece.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> A capstone isn’t just a task—it’s your proof of growth.</div>
            </ol></div>`
        },
        {
            title: "Choosing Your Dataset",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Pick a topic you care about: business, health, education, finance, etc.</li>
                <li>Use open data portals like Kaggle, Data.gov, or Kenya Open Data.</li>
                <li>Make sure the dataset is clean enough to work with, but rich enough to explore.</li>
                <li>Check for columns you can analyze and visualize.</li>
                <li>Save your source and document your choice.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Choose data that speaks to you—your passion will power your project.</div>
            </ol></div>`
        },
        {
            title: "Defining Your Question",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Start with a clear, specific question.</li>
                <li>Examples: “Which region has the highest sales?” or “What factors affect student performance?”</li>
                <li>Break it into sub-questions if needed.</li>
                <li>Your question guides your entire analysis.</li>
                <li>Make sure it’s answerable with the data you have.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> A good question is half the answer—ask wisely.</div>
            </ol></div>`
        },
        {
            title: "Planning Your Workflow",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Step 1: Import and clean your data.</li>
                <li>Step 2: Explore with summaries and visuals.</li>
                <li>Step 3: Build dashboards or reports.</li>
                <li>Step 4: Present findings with slides or notebooks.</li>
                <li>Step 5: Reflect and document your process.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Plan your path—then walk it with purpose.</div>
            </ol></div>`
        },
        {
            title: "Tools You Can Use",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Tool:</strong> Excel – Cleaning, formulas, dashboards</li>
                <li><strong>Tool:</strong> Power BI – Visuals, dashboards, sharing</li>
                <li><strong>Tool:</strong> Python – Cleaning, analysis, automation</li>
                <li><strong>Tool:</strong> SQL – Querying and joining data</li>
                <li>Use any combination of tools you’ve learned.</li>
                <li>Choose based on your comfort and project needs.</li>
                <li>Document which tools you used and why.</li>
                <li>Show versatility and depth.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your tools are your voice—choose the ones that speak best.</div>
            </ol></div>`
        },
        {
            title: "Presenting Your Capstone",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Create a 5–7 slide presentation or dashboard.</li>
                <li>Include your question, process, insights, and recommendations.</li>
                <li>Use visuals to support your story.</li>
                <li>Practice your delivery and timing.</li>
                <li>Share with peers, mentors, or online communities.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your capstone is your spotlight—step up and shine.</div>
            </ol></div>`
        },
        {
            title: "Peer Review & Feedback",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Present your project to a peer or mentor.</li>
                <li>Ask for feedback on clarity, visuals, and insights.</li>
                <li>Reflect on what worked and what could improve.</li>
                <li>Use feedback to refine your final version.</li>
                <li>Learning from others sharpens your skills.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Feedback isn’t criticism—it’s collaboration.</div>
            </ol></div>`
        },
        {
            title: "Graduation & Certification",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Celebrate completing all modules and your capstone.</li>
                <li>Receive your certificate of completion.</li>
                <li>Share your achievement on LinkedIn or your portfolio.</li>
                <li>Reflect on your growth and next steps.</li>
                <li>You’re now a certified data analyst.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Graduation isn’t the end—it’s your launchpad.</div>
            </ol></div>`
        },
        {
            title: "Next Steps in Your Journey",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Build your portfolio with more projects.</li>
                <li>Apply for internships or freelance gigs.</li>
                <li>Join data communities and attend meetups.</li>
                <li>Keep learning new tools and trends.</li>
                <li>Set goals for the next 3–6 months.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your journey continues—every dataset is a new adventure.</div>
            </ol></div>`
        },
        {
            title: "Practical: Complete Your Capstone",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Choose a dataset and define your question.</li>
                <li>Clean, analyze, and visualize the data.</li>
                <li>Create a presentation or dashboard.</li>
                <li>Present to a peer or mentor.</li>
                <li>Submit for review and certification.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> This is your final challenge—show what you’ve learned, and who you’ve become.</div>
            </ol></div>`
        },
        {
            title: "Q&A",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>What if I’m stuck choosing a topic? → Pick something personal or relevant.</li>
                <li>What if my data is messy? → Clean what you can and explain the limitations.</li>
                <li>What if I don’t finish on time? → Focus on progress, not perfection.</li>
                <li>What if I’m nervous to present? → Practice and remember—you’ve earned this.</li>
                <li>What if I want to keep going? → You absolutely should.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Every question is valid—this is your space to grow.</div>
            </ol></div>`
        },
        {
            title: "Key Takeaways",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li>Your capstone is your proof of learning and growth.</li>
                <li>Choose a meaningful dataset and question.</li>
                <li>Use your skills across tools and techniques.</li>
                <li>Present with clarity and confidence.</li>
                <li>You’re ready for the world of data.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> You didn’t just learn data—you became an analyst.</div>
            </ol></div>`
        },
        {
            title: "Final Reflect & Share",
            content: `<div class="ai-slide-block"><ol class='highlight-list'>
                <li><strong>Task:</strong></li>
                <li>Write a short reflection:</li>
                <li>What did you learn?</li>
                <li>What surprised you?</li>
                <li>What are you proud of?</li>
                <li>Share your capstone and reflection with your cohort or online.</li>
                <li>Celebrate your achievement—you’ve earned it.</li>
                <hr><div class="activity-block"><strong>Food for the Mind:</strong> Your final challenge is reflection—look back, then leap forward.</div>
            </ol></div>`
        }
    ]
},
    ];

    // Celebration helpers (reuse global confetti library and audio element)
    var _confettiInterval = null;
    function startCelebration() {
        // Avoid multiple intervals
        if (_confettiInterval) return;
        // Fire confetti in bursts; reduce intensity on small screens
        var particleCount = window.innerWidth < 600 ? 40 : 80;
        _confettiInterval = setInterval(function(){
            if (typeof confetti === 'function') {
                confetti({ particleCount: particleCount, spread: 100, origin: { y: 0.6 } });
            }
        }, 800);
        // play audio if available
        try {
            var cheer = document.getElementById('cheerAudio');
            if (cheer) {
                cheer.loop = true;
                cheer.volume = 0.7;
                cheer.play().catch(function(){});
            }
        } catch (e) {}
    }

    function stopCelebration() {
        if (_confettiInterval) { clearInterval(_confettiInterval); _confettiInterval = null; }
        try { var cheer = document.getElementById('cheerAudio'); if (cheer) { cheer.pause(); cheer.currentTime = 0; } } catch(e) {}
    }
const welcomeSlide = {
    title: "Welcome to Tujengane Analyst Pro",
    content: `
    <div class="welcome-block" style="padding:1.2rem 0.5rem 1rem 0.5rem; text-align:center; max-width: 98vw; min-height: 0;">
        <div style="font-size:1rem; color:#333; margin-bottom:1rem;">
            Welcome to our 13-week digital skills course by <strong>EXES BI</strong>!<br>
            <span style="color:#256d4f; font-weight:600;">Choose your next step below or use the sidebar to explore modules.</span>
        </div>
        <div class="welcome-links" style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.7rem; margin-bottom:1.2rem;">
            <a href="../Tujengane Analyst Pro/analystpro.html" class="welcome-card" style="background:#facc15; color:#1e293b; border-radius:0.7rem; padding:1rem 1.2rem; font-weight:700; font-size:0.98rem; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-decoration:none; transition:transform 0.2s; display:flex; flex-direction:column; align-items:center; min-width:120px;">
                <i class="fas fa-chart-bar" style="font-size:1.2rem; margin-bottom:0.3rem;"></i>
                For Aspiring Data Analysts<br><span style="font-weight:400; font-size:0.9rem;">Go to Analyst Pro</span>
            </a>
            <a href="../computer basicss/computerbasicss.html" class="welcome-card" style="background:#49A078; color:#fff; border-radius:0.7rem; padding:1rem 1.2rem; font-weight:700; font-size:0.98rem; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-decoration:none; transition:transform 0.2s; display:flex; flex-direction:column; align-items:center; min-width:120px;">
                <i class="fas fa-database" style="font-size:1.2rem; margin-bottom:0.3rem;"></i>
                For Beginner Analysts<br><span style="font-weight:400; font-size:0.9rem;">Go to Data Basics</span>
            </a>
            <a href="https://exesbi.netlify.app/" target="_blank" class="welcome-card" style="background:#256d4f; color:#fff; border-radius:0.7rem; padding:1rem 1.2rem; font-weight:700; font-size:0.98rem; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-decoration:none; transition:transform 0.2s; display:flex; flex-direction:column; align-items:center; min-width:120px;">
                <i class="fas fa-rocket" style="font-size:1.2rem; margin-bottom:0.3rem;"></i>
                For Professional Analysis<br><span style="font-weight:400; font-size:0.9rem;">Visit EXES BI</span>
            </a>
        </div>
        <div style="font-size:0.93rem; color:#666; margin-bottom:0.7rem;">
            <strong>Instructions:</strong> Use the sidebar to select a module and start your journey. Each module contains step-by-step lessons and practical activities.<br>
            <span style="color:#256d4f;">Ready to grow your digital skills? Start now!</span>
        </div>
        <div style="font-size:0.9rem; color:#888; margin-top:0.5rem;">
            <em>EXES BI – Empowering your future with practical digital skills.</em>
        </div>
    </div>
    `
};

let currentModule = null;
let currentSlide = 0;
let isSidebarOpen = false;

const slideContainer = document.getElementById('slide-container');
const currentSlideDisplay = document.getElementById('current-slide');
const totalSlidesDisplay = document.getElementById('total-slides');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.querySelector('.sidebar');
const navLinks = document.getElementById('nav-links');

function updateSlide(moduleIndex, slideIndex) {
    // stop any running celebration when switching slides
    try { stopCelebration(); } catch(e) {}
    const slide = moduleIndex !== null ? modules[moduleIndex].slides[slideIndex] : welcomeSlide;
    slideContainer.innerHTML = `
        <div class="slide-content">
            <h2>${slide.title}</h2>
            ${slide.content}
        </div>
    `;
    slideContainer.classList.add('active');

    if (moduleIndex !== null) {
        currentSlideDisplay.textContent = slideIndex + 1;
        totalSlidesDisplay.textContent = modules[moduleIndex].slides.length;
        prevBtn.disabled = slideIndex === 0;
        nextBtn.disabled = slideIndex === modules[moduleIndex].slides.length - 1 && moduleIndex === modules.length - 1;
        document.querySelector('.navigation').classList.remove('hidden');
        document.getElementById('slide-number-display').classList.remove('hidden');
    document.getElementById('slide-number-display').textContent = `Module ${moduleIndex + 1} — ${modules[moduleIndex].title} - Slide ${slideIndex + 1} of ${modules[moduleIndex].slides.length}`;
    } else {
        currentSlideDisplay.textContent = 0;
        totalSlidesDisplay.textContent = 0;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        document.querySelector('.navigation').classList.add('hidden');
        document.getElementById('slide-number-display').classList.add('hidden');
    }

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        link.parentElement.classList.remove('active');
    });
    if (moduleIndex !== null) {
        const activeLink = document.querySelector(`.sidebar-link[data-module="${moduleIndex}"][data-slide="${slideIndex}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.parentElement.classList.add('active');
        }
    }

    // If this is the last slide of the last module, trigger celebration
    try {
        var isLastModule = moduleIndex === (modules.length - 1);
        var isLastSlide = moduleIndex !== null && slideIndex === (modules[moduleIndex].slides.length - 1);
        if (isLastModule && isLastSlide) {
            // small timeout to ensure DOM is painted
            setTimeout(function(){ startCelebration(); }, 150);
        }
    } catch (e) { /* ignore */ }
}

function toggleModule(moduleIndex) {
    const moduleToggles = document.querySelectorAll('.module-toggle');
    const moduleSlides = document.querySelectorAll('.module-slides');

    moduleToggles.forEach((toggle, index) => {
        if (index === moduleIndex) {
            toggle.classList.toggle('collapsed');
            moduleSlides[index].classList.toggle('open', !toggle.classList.contains('collapsed'));
            toggle.classList.remove('hidden');
        } else {
            toggle.classList.add('hidden');
            moduleSlides[index].classList.remove('open');
        }
    });

    if (moduleIndex !== null && moduleToggles[moduleIndex].classList.contains('collapsed')) {
        currentModule = null;
        currentSlide = 0;
        updateSlide(null, 0);
        moduleToggles.forEach(toggle => toggle.classList.remove('hidden'));
    } else if (moduleIndex !== null) {
        currentModule = moduleIndex;
        currentSlide = 0;
        updateSlide(moduleIndex, 0);
    }
}

document.querySelectorAll('.module-toggle').forEach((toggle, index) => {
    toggle.addEventListener('click', () => toggleModule(index));
    toggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleModule(index);
        }
    });
});

document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const moduleIndex = parseInt(link.dataset.module);
        const slideIndex = parseInt(link.dataset.slide);
        currentModule = moduleIndex;
        currentSlide = slideIndex;
        updateSlide(moduleIndex, slideIndex);
    });
});

// Ensure visible sidebar numbers reflect module.slide (non-destructive runtime fix)
function setSidebarNumbers() {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        try {
            var m = parseInt(link.dataset.module);
            var s = parseInt(link.dataset.slide);
            var span = link.querySelector('.slide-number');
            if (span && !isNaN(m) && !isNaN(s)) {
                // format like "1.1." to match existing dot-style numbering
                span.textContent = (m + 1) + '.' + (s + 1) + '.';
            }
        } catch (e) { /* ignore bad entries */ }
    });
}

// Run once now to update static markup; it's safe and reversible (only updates span text)
try { setSidebarNumbers(); } catch (e) { /* ignore */ }

prevBtn.addEventListener('click', () => {
    showNavigationFeedback('prev');
    handlePrev();
});
nextBtn.addEventListener('click', () => {
    showNavigationFeedback('next');
    handleNext();
});

hamburgerBtn.addEventListener('click', () => {
    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('active', isSidebarOpen);
});

document.addEventListener('click', (e) => {
    if (isSidebarOpen && !sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        isSidebarOpen = false;
        sidebar.classList.remove('active');
    }
});

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const chatOverlay = document.getElementById('chatOverlay');
    chatWidget.classList.toggle('hidden');
    chatOverlay.classList.toggle('hidden');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById('chatOverlay').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById('chatOverlay').classList.add('hidden');
}

// Show welcome only if no module is open at start
if (currentModule === null && currentSlide === 0) {
    updateSlide(null, 0);
}

function checkOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const slideContainerWrapper = document.querySelector('.slide-container-wrapper');
    const chatButton = document.getElementById('chatButton');
    const chatWidget = document.getElementById('chatWidget');
    const navigation = document.querySelector('.navigation');
    const footer = document.querySelector('.footer');
    const layout = document.querySelector('.layout');

    if (isLandscape && window.innerWidth <= 768) {
        slideContainerWrapper.style.paddingBottom = '250px';
        chatButton.style.bottom = '120px';
        chatButton.style.zIndex = '60';
        chatWidget.style.bottom = '140px';
        chatWidget.style.zIndex = '60';
        navigation.style.bottom = '0';
        navigation.style.zIndex = '50';
        footer.style.position = 'relative';
        layout.style.marginBottom = '0';
    } else if (isLandscape && window.innerWidth <= 480) {
        slideContainerWrapper.style.paddingBottom = '200px';
        chatButton.style.bottom = '100px';
        chatButton.style.zIndex = '60';
        chatWidget.style.bottom = '120px';
        chatWidget.style.zIndex = '60';
        navigation.style.bottom = '0';
        navigation.style.zIndex = '50';
        footer.style.position = 'relative';
        layout.style.marginBottom = '0';
    } else {
        // Reset to default
        slideContainerWrapper.style.paddingBottom = '';
        chatButton.style.bottom = '';
        chatButton.style.zIndex = '';
        chatWidget.style.bottom = '';
        chatWidget.style.zIndex = '';
        navigation.style.bottom = '';
        navigation.style.zIndex = '';
        footer.style.position = '';
        layout.style.marginBottom = '';
    }
}

// Call on load and resize
checkOrientation();
window.addEventListener('resize', checkOrientation);

// Password Protection System - previously inline
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation systems
    initializeSwipeNavigation();
    initializeKeyboardNavigation();
    
    var correctPassword = 'analyst2025';
    var tries = 0;
    var sessionKey = 'tujengane_analyst_authenticated';

    // If already authenticated in this session, reveal page
    try {
        if (sessionStorage.getItem(sessionKey) === 'true') { 
            document.body.style.display = ''; 
            return; 
        }
    } catch (e) {}

    function showWhatsAppOverlay(){
        var waUrl = 'https://wa.me/254791360805?text=' + encodeURIComponent('Hey, I am requesting for the password to access Tujengane Analyst Pro.');
        var wrapper = document.createElement('div');
        wrapper.id = 'waIframeWrapper';
        wrapper.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;';

        var bgFrame = document.createElement('iframe');
        bgFrame.src = '../index.html';
        bgFrame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        bgFrame.setAttribute('aria-hidden','true');

        var backdrop = document.createElement('div');
        backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.42);backdrop-filter:blur(2px);pointer-events:none;';

        var box = document.createElement('div');
        box.style.cssText = 'position:relative;max-width:520px;width:100%;background:linear-gradient(180deg, rgba(20,20,20,0.95), rgba(18,18,18,0.96));color:#fff;padding:18px;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.5);font-family:system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;z-index:100002;';
        box.innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="flex:1;min-width:0">
                    <div style="font-weight:800;font-size:1.05rem;color:#fff;">Access blocked</div>
                    <div style="margin-top:6px;color:#ddd;font-size:0.95rem;line-height:1.25">We couldn't verify your access. Use the button below to message us on WhatsApp to request access. You must click the link to open WhatsApp.</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;align-items:center;">
                <a id="waOpenLink" href="${waUrl}" target="_blank" rel="noopener noreferrer" style="background:#25D366;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:700;">Open WhatsApp</a>
                <button id="waCopyBtn" style="background:transparent;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:9px 12px;border-radius:8px;cursor:pointer;">Copy link</button>
                <button id="waCancelBtn" style="background:transparent;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:9px 12px;border-radius:8px;cursor:pointer;">Cancel</button>
            </div>
        `;

        wrapper.appendChild(bgFrame);
        wrapper.appendChild(backdrop);
        wrapper.appendChild(box);
        document.documentElement.appendChild(wrapper);

        var toast = document.createElement('div');
        toast.id = 'waToast';
        toast.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:36px;background:rgba(0,0,0,0.8);color:#fff;padding:8px 12px;border-radius:8px;z-index:100003;display:none;font-size:0.95rem;';
        toast.textContent = 'Link copied to clipboard';
        document.documentElement.appendChild(toast);

        document.getElementById('waCopyBtn').addEventListener('click', function(){
            try {
                navigator.clipboard.writeText(waUrl).then(function(){
                    toast.style.display = 'block';
                    setTimeout(function(){ toast.style.display='none'; }, 1800);
                }, function(){
                    var ta = document.createElement('textarea'); ta.value = waUrl; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast.style.display = 'block'; setTimeout(function(){ toast.style.display='none'; },1800); } catch(e){} ta.remove();
                });
            } catch(e){
                var ta = document.createElement('textarea'); ta.value = waUrl; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast.style.display = 'block'; setTimeout(function(){ toast.style.display='none'; },1800); } catch(err){} ta.remove();
            }
        });
        document.getElementById('waCancelBtn').addEventListener('click', function(){ window.location.href = '../index.html'; });
    }

    function askPassword() {
        var wrapper = document.createElement('div');
        wrapper.id = 'pwModalWrapper';
        wrapper.style.cssText = 'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;';

        var bgFrame = document.createElement('iframe');
        bgFrame.src = '../index.html';
        bgFrame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        bgFrame.setAttribute('aria-hidden','true');

        var backdrop = document.createElement('div');
        backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.42);backdrop-filter:blur(2px);pointer-events:none;';

        var box = document.createElement('div');
        box.style.cssText = 'position:relative;max-width:520px;width:100%;background:linear-gradient(180deg, rgba(20,20,20,0.95), rgba(18,18,18,0.96));color:#fff;padding:18px;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.5);font-family:system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;z-index:100002;';
        box.innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="flex:1;min-width:0">
                    <div style="font-weight:800;font-size:1.05rem;color:#fff;">Authorized access</div>
                    <div style="margin-top:6px;color:#ddd;font-size:0.95rem;line-height:1.25">This section is for authorized users only. Enter the password to continue.</div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px;">
                <div style="display:flex;gap:8px;align-items:center;min-width:0;">
                    <input id="pwInput" type="password" placeholder="Password" style="flex:1;min-width:0;padding:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(0,0,0,0.26);color:#fff;border-radius:8px;font-size:1rem;">
                    <button id="pwToggle" aria-label="Show password" style="background:transparent;border:0;font-size:1.1rem;cursor:pointer;color:#fff;opacity:0.95;margin-left:6px;flex:0 0 auto;">👁️</button>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:nowrap;">
                    <button id="pwCancel" style="background:transparent;border:1px solid rgba(255,255,255,0.12);padding:9px 12px;border-radius:8px;cursor:pointer;color:#fff;flex:0 0 auto;white-space:nowrap;">Cancel</button>
                    <button id="pwSubmit" style="background:#49A078;color:#fff;border:0;padding:10px 14px;border-radius:8px;cursor:pointer;font-weight:700;flex:0 0 auto;white-space:nowrap;">Submit</button>
                </div>
            </div>
        `;

        wrapper.appendChild(bgFrame);
        wrapper.appendChild(backdrop);
        wrapper.appendChild(box);
        document.documentElement.appendChild(wrapper);

        var pwInput = document.getElementById('pwInput');
        if (pwInput) pwInput.focus();

        function cleanup(){ var w = document.getElementById('pwModalWrapper'); if (w) w.remove(); }

        document.getElementById('pwToggle').addEventListener('click', function(){
            if (pwInput.type === 'password') { pwInput.type = 'text'; this.textContent = '🙈'; } else { pwInput.type = 'password'; this.textContent = '👁️'; }
            pwInput.focus();
        });

        document.getElementById('pwCancel').addEventListener('click', function(){ cleanup(); window.location.href = '../index.html'; });

        document.getElementById('pwSubmit').addEventListener('click', function(){
            var input = (pwInput && pwInput.value) ? pwInput.value : '';
            if (input === correctPassword) {
                try { sessionStorage.setItem(sessionKey, 'true'); } catch(e) {}
                cleanup();
                document.body.style.display = '';
                return;
            }
            tries++;
            cleanup();
            if (tries >= 2) { showWhatsAppOverlay(); return; }
            askPassword();
        });

        if (pwInput) {
            pwInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') { document.getElementById('pwSubmit').click(); } });
        }
    }

    document.body.style.display = 'none';
    askPassword();
});

// Show floating Home button only on small screens - previously inline
function toggleFloatingHomeBtn() {
    var btn = document.getElementById('floatingHomeBtn');
    if (!btn) return;
    if (window.innerWidth <= 768) {
        btn.style.display = 'flex';
    } else {
        btn.style.display = 'none';
    }
}
window.addEventListener('resize', toggleFloatingHomeBtn);
window.addEventListener('DOMContentLoaded', toggleFloatingHomeBtn);

// Close chat widget when clicking outside - previously inline
document.addEventListener('mousedown', function(event) {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    if (!chatWidget.classList.contains('hidden')) {
        if (!chatWidget.contains(event.target) && !chatButton.contains(event.target)) {
            chatWidget.classList.add('hidden');
        }
    }
});

// Improved runtime list fixer - previously inline
/* Improved runtime list fixer
   Rules implemented (non-destructive):
   - Lists containing code, tables, or sub-headers => `.none`
   - Lists that immediately follow a code block (previous sibling is pre/code) => `.bullet`
   - Short ordered lists or lists with 'Step'/'Task' indicators => `.seq`
   - Heuristic: lists with titles like 'Notes' or 'Takeaways' => `.diamond`
   - Fallback: UL => bullet, OL => seq
   - Uses MutationObserver to handle dynamic slide injection
*/
(function(){
    var processedFlag = '_listProcessedV2';
    function textNearby(node) {
        if (!node) return '';
        var t = '';
        if (node.previousElementSibling) t += ' ' + (node.previousElementSibling.getAttribute('data-title') || node.previousElementSibling.textContent || '');
        if (node.parentElement && node.parentElement.previousElementSibling) t += ' ' + (node.parentElement.previousElementSibling.textContent || '');
        return t.toLowerCase();
    }

    function isSequentialCandidate(list){
        // Prefer numbers when list is explicitly OL and items look like ordered tasks
        if (list.tagName && list.tagName.toLowerCase() === 'ol') return true;
        // if the heading/text contains 'step' or 'task' or 'sequence'
        var near = textNearby(list);
        if (/\b(step|steps|task|tasks|sequence|sequential|first|second|third)\b/i.test(near)) return true;
        // short lists of 2-6 items that contain digits or 'then' often are sequential
        var items = list.querySelectorAll('li');
        if (items.length > 1 && items.length <= 6) {
            var digity = 0;
            items.forEach(function(li){ if (/\d+\b/.test(li.textContent)) digity++; if (/\bthen\b/i.test(li.textContent)) digity++; });
            if (digity >= 1) return true;
        }
        return false;
    }

    function processHighlightLists(root){
        root = root || document;
        var lists = root.querySelectorAll('.highlight-list');
        lists.forEach(function(list){
            if (list.dataset[processedFlag]) return;

            // Only treat lists as "none" when they contain block-level complex content
            // (tables, block <pre> examples, list-items that include headers or activity blocks).
            // Avoid matching inline <code> so normal points with inline code still get bullets.
            // Keep bullets for lists that contain code lines; only treat truly complex/block content as 'none'
            var containsComplex = !!list.querySelector('table, thead, tbody, li h3, li h4, li .activity-block, .demo-table');
            var prev = list.previousElementSibling;
            var followsCode = prev && (prev.tagName.toLowerCase() === 'pre' || prev.tagName.toLowerCase() === 'code' || prev.querySelector && (prev.querySelector('pre, code')));

            // Clear marker classes we may have added earlier (except user-specified ones)
            list.classList.remove('seq','bullet','asterisk','none','diamond');

            if (containsComplex) {
                list.classList.add('none');
            } else if (followsCode) {
                // After a code example, prefer bullets rather than continuing numbering
                list.classList.add('bullet');
            } else if (isSequentialCandidate(list)) {
                list.classList.add('seq');
            } else {
                // Heuristic for notes/digest lists
                var near = textNearby(list);
                if (/\b(note|notes|takeaway|takeaways|summary|key point|key points)\b/i.test(near)) {
                    list.classList.add('diamond');
                } else {
                    // Default to a neutral bullet for non-sequential content
                    list.classList.add('bullet');
                }
            }

            // If the list is inside a LI that itself is part of an OL, avoid re-numbering subheaders
            var parentLi = list.closest('li');
            if (parentLi && parentLi.parentElement && parentLi.parentElement.tagName.toLowerCase() === 'ol') {
                // sub-lists should not create new top-level numbers; prefer none or bullets
                if (list.classList.contains('seq')) {
                    list.classList.remove('seq');
                    list.classList.add('bullet');
                }
            }

            // small accessibility hint: ensure lists with no markers have left padding so content aligns
            if (list.classList.contains('none')) {
                list.style.paddingLeft = '0.5rem';
            } else {
                list.style.paddingLeft = '';
            }

            list.dataset[processedFlag] = '1';
        });
    }

    function runOnce() { processHighlightLists(document); }

    document.addEventListener('DOMContentLoaded', function(){
        setTimeout(runOnce, 120);
        var container = document.getElementById('slide-container') || document.body;
        try {
            var mo = new MutationObserver(function(mutations){
                // re-process only when nodes are added
                var changed = false;
                for (var i=0;i<mutations.length;i++) { if (mutations[i].addedNodes && mutations[i].addedNodes.length>0) { changed = true; break; } }
                if (changed) processHighlightLists(document);
            });
            mo.observe(container, { childList: true, subtree: true });
        } catch (e) {
            setInterval(runOnce, 1200);
        }
    });
})();

// Touch swipe navigation variables
let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;
let isNavigating = false;
const minSwipeDistance = 50;
const navigationDelay = 300; // Prevent too rapid navigation

// Visual feedback functions
function showNavigationFeedback(direction) {
    const feedbackId = direction === 'prev' ? 'nav-feedback-left' : 'nav-feedback-right';
    const feedbackEl = document.getElementById(feedbackId);
    if (feedbackEl) {
        // Clear any existing timeout
        if (feedbackEl.hideTimeout) {
            clearTimeout(feedbackEl.hideTimeout);
        }
        
        feedbackEl.classList.add('show');
        
        // Auto-hide after a delay
        feedbackEl.hideTimeout = setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 1200);
    }
}

// Add visual feedback for disabled navigation
function showDisabledFeedback(direction) {
    const feedbackId = direction === 'prev' ? 'nav-feedback-left' : 'nav-feedback-right';
    const feedbackEl = document.getElementById(feedbackId);
    if (feedbackEl) {
        const originalBg = feedbackEl.style.background;
        feedbackEl.style.background = 'rgba(156, 163, 175, 0.9)';
        feedbackEl.classList.add('show');
        
        setTimeout(() => {
            feedbackEl.classList.remove('show');
            feedbackEl.style.background = originalBg;
        }, 600);
    }
}

// Touch event handlers for swipe navigation
function handleTouchStart(e) {
    // Only handle single finger touches
    if (e.touches.length !== 1) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    // Only handle single finger touches
    if (e.changedTouches.length !== 1) return;
    if (!touchStartX || !touchStartY) return;
    
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe (not vertical scroll)
    // Require more horizontal movement than vertical to avoid interfering with scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // Prevent default behavior for horizontal swipes
        e.preventDefault();
        
        if (deltaX > 0) {
            // Swipe right - go to previous slide
            showNavigationFeedback('prev');
            handlePrev();
        } else {
            // Swipe left - go to next slide  
            showNavigationFeedback('next');
            handleNext();
        }
    }
    
    // Reset touch variables
    touchStartX = null;
    touchStartY = null;
    touchEndX = null;
    touchEndY = null;
}

// Handle touch move to prevent scrolling during horizontal swipes
function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchMoveX = e.touches[0].clientX;
    const touchMoveY = e.touches[0].clientY;
    
    const deltaX = touchMoveX - touchStartX;
    const deltaY = touchMoveY - touchStartY;
    
    // If it's clearly a horizontal swipe, prevent vertical scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
    }
}

// Enhanced navigation functions with feedback
function ensureModuleOpen(moduleIndex) {
    if (moduleIndex === null) return;
    
    const moduleToggles = document.querySelectorAll('.module-toggle');
    const moduleSlides = document.querySelectorAll('.module-slides');

    moduleToggles.forEach((toggle, index) => {
        if (index === moduleIndex) {
            // Force module to be open (remove collapsed class)
            toggle.classList.remove('collapsed');
            moduleSlides[index].classList.add('open');
            toggle.classList.remove('hidden');
        } else {
            toggle.classList.add('hidden');
            moduleSlides[index].classList.remove('open');
        }
    });
}

function handlePrev() {
    if (isNavigating) {
        showDisabledFeedback('prev');
        return;
    }
    
    // If on welcome screen, show disabled feedback
    if (currentModule === null) {
        showDisabledFeedback('prev');
        return;
    }
    
    if (currentModule !== null && currentSlide > 0) {
        isNavigating = true;
        currentSlide--;
        updateSlide(currentModule, currentSlide);
        setTimeout(() => { isNavigating = false; }, navigationDelay);
    } else {
        // Show disabled feedback when at beginning
        showDisabledFeedback('prev');
    }
}

function handleNext() {
    if (isNavigating) {
        showDisabledFeedback('next');
        return;
    }
    
    // If on welcome screen, go to first module (Module 1)
    if (currentModule === null) {
        isNavigating = true;
        currentModule = 0; // First module
        currentSlide = 0;  // First slide
        ensureModuleOpen(currentModule);
        updateSlide(currentModule, currentSlide);
        setTimeout(() => { isNavigating = false; }, navigationDelay);
        return;
    }
    
    if (currentModule !== null) {
        if (currentSlide < modules[currentModule].slides.length - 1) {
            isNavigating = true;
            currentSlide++;
            updateSlide(currentModule, currentSlide);
            setTimeout(() => { isNavigating = false; }, navigationDelay);
        } else if (currentModule < modules.length - 1) {
            isNavigating = true;
            currentModule++;
            currentSlide = 0;
            ensureModuleOpen(currentModule);
            updateSlide(currentModule, 0);
            setTimeout(() => { isNavigating = false; }, navigationDelay);
        } else {
            // Show disabled feedback when at end
            showDisabledFeedback('next');
        }
    }
}

// Initialize swipe navigation
function initializeSwipeNavigation() {
    const slideContainer = document.getElementById('slide-container');
    const mainContent = document.querySelector('.main-content');
    
    if (slideContainer) {
        slideContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        slideContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        slideContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    
    if (mainContent) {
        mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainContent.addEventListener('touchmove', handleTouchMove, { passive: false });
        mainContent.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Don't interfere with input fields or text areas
        const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
        if (isInputActive) return;
        
        // Left arrow key or Page Up - previous slide
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            showNavigationFeedback('prev');
            handlePrev();
        }
        // Right arrow key, Page Down, or Space - next slide
        else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            showNavigationFeedback('next');
            handleNext();
        }
        // Home key - go to first slide
        else if (e.key === 'Home') {
            e.preventDefault();
            if (currentModule !== null && currentSlide !== 0) {
                currentSlide = 0;
                updateSlide(currentModule, currentSlide);
            }
        }
        // End key - go to last slide of current module
        else if (e.key === 'End') {
            e.preventDefault();
            if (currentModule !== null) {
                const lastSlide = modules[currentModule].slides.length - 1;
                if (currentSlide !== lastSlide) {
                    currentSlide = lastSlide;
                    updateSlide(currentModule, currentSlide);
                }
            }
        }
    });
}

// Mobile navigation functionality
function setupMobileNavigation() {
    const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');
    const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const floatingHomeBtn = document.getElementById('floatingHomeBtn');
    
    // Mobile navigation trigger - use floating home button
    if (floatingHomeBtn) {
        floatingHomeBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            mobileNavDropdown.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking backdrop
    if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener('click', () => {
            mobileNavDropdown.classList.remove('active');
        });
    }
    
    // Close mobile nav when clicking close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            mobileNavDropdown.classList.remove('active');
        });
    }
    
    // Close mobile nav when clicking any link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavDropdown.classList.remove('active');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = mobileNavDropdown.contains(e.target);
        const isHomeButtonClick = floatingHomeBtn && floatingHomeBtn.contains(e.target);
        
        if (!isClickInsideNav && !isHomeButtonClick && mobileNavDropdown.classList.contains('active')) {
            mobileNavDropdown.classList.remove('active');
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavDropdown.classList.contains('active')) {
            mobileNavDropdown.classList.remove('active');
        }
    });
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMobileNavigation);
