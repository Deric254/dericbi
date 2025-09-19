#Import iportant libralies
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
#load the csv in a data frame 
df=pd.read_csv(r'C:\Users\A\OneDrive\Desktop\Master_plan\Data_Analysis_Camp\Data_Analyst_plan\Learning_phase\datasets\Raw_datasets\Mini_Projects_datasets\student_exams.csv')
#Preview the loaded csv head and tail all 5 rows each
print ("\n 1.preview of the first 5 rows \n ",df.head(),"\n 2. Preview of thelast 5 rows \n \n",df.tail())
# check all unique data in each collumn collumn
print("\n checking all unique collumns \n ",df.columns.unique())
print ("\n This shows all unique items in each collumn \n ",'1.column score',df['score'].unique())
print ("\n \n ",'2.student_id',df['student_id'].unique())
print ("\n  \n ",'3.student_name',df['student_name'].unique())
print ("\n \n ",'4.exam',df['exam'].unique())
print ("\n  \n ",'5.exam_date',df['exam_date'].unique())
print ("\n  \n ",'6.subject_code',df['subject_code'].unique())
print ("\n \n ",'7.teacher_id',df['teacher_id'].unique())
print ("\n  \n ",'8.column score',df['score'].unique())
#  total numm in collumns and preview of collumns and nulls 
print("\n 1. this shows all the nulls in each collumn \n ",df.isnull().sum())
print(" \n There are the duplicates \n",df.duplicated())
print(" \n There are ", df.duplicated().sum(),"duplicated rows")
#clean time we are cleaning duplicates , replacing unwanted figures and setting data types 
df['score'] = df['score'].replace(['N/A', '*'], '')  # Remove N/A, * 
df['score'] = df['score'].astype(float)  # Make number 
avg_score = df['score'].mean()  # Average score 
avg_score =round(avg_score,0)
# filling empty scores with calculated mean 
df['score'] = df['score'].fillna(avg_score)  # Fill missing 
# Fix score  all negatives and over 4 made to mean 
df.loc[df['score'] < 0, 'score'] = 3  # Negative to 0 
df.loc[df['score'] > 5, 'score'] = 3  # Cap at 5 
# Clean teacher_id 
df['teacher_id'] = df['teacher_id'].fillna('Unknown') 
# Remove duplicates  by dropping them
df = df.drop_duplicates() 
# Fix exam by lowercasing and cleaning unwanted and setting them to wanted figures 
df['exam'] = df['exam'].str.lower() 
df['exam'] = df['exam'].replace(['mathemactics activities', 'maths'], 'Mathematics Activities') 
# Fix student_name 
df['student_name'] = df['student_name'].replace(['Dolycite', 'Dolyte'], 'Dolycte') 
# Fix exam_date  by setting in to one format
df['exam_date'] = pd.to_datetime(df['exam_date'], errors='coerce', format='mixed') 
most_common_date = df['exam_date'].mode()[0] 
df['exam_date'] = df['exam_date'].fillna(most_common_date) 
# fixing  subjects and mapping subject codes 
# Create a mapping dictionary
exam_to_code = {
    'Language Activities': 'LANG001', 
    'Religious Activities': 'REL001', 
    'Mathematics Activities': 'MATH001', 
    'Environment Activities': 'ENV001', 
    'Creative Activities': 'CRE001', 
    'Kiswahili': 'LANG002'
}

# Identify rows where subject_code is 'Unknown' and update them based on exam column
mask = df['subject_code'] == 'Unknown'
df.loc[mask, 'subject_code'] = df.loc[mask, 'exam'].map(exam_to_code)
# Save cleaned data 
 # Calculate average score 
avg_score = df['score'].mean() 
# Average by subject 
subject_scores = df.groupby('exam')['score'].mean().reset_index() 
# Average by month 
monthly_scores = df.groupby('exam_date')['score'].mean().reset_index() 
print('Overall Average Score:', avg_score) 
print('Scores by Subject:\n', subject_scores) 
print('Scores by Month:\n', monthly_scores)

# Line chart 
plt.figure(figsize=(6, 3)) 
sns.lineplot(x='exam_date', y='score', data=monthly_scores) 
plt.title('Average Score by Month') 
plt.tight_layout()
plt.savefig(r'C:\Users\A\OneDrive\Desktop\Master_plan\Data_Analysis_Camp\Data_Analyst_plan\Portfolio_Freelance\student_performance_project\python\lineplot.jpeg',dpi=300,bbox_inches='tight')
plt.show()

 # Bar chart 
plt.figure(figsize=(6, 3)) 
sns.barplot(x='score', y='exam', data=subject_scores) 
plt.title('Average Score by Subject') 
plt.tight_layout()
plt.savefig(r'C:\Users\A\OneDrive\Desktop\Master_plan\Data_Analysis_Camp\Data_Analyst_plan\Portfolio_Freelance\student_performance_project\python\barplot.jpeg',dpi=300,bbox_inches='tight')
plt.show()
# saving the cleaned version 
df.to_csv(r'C:\Users\A\OneDrive\Desktop\Master_plan\Data_Analysis_Camp\Data_Analyst_plan\Learning_phase\datasets\cleaned_data_sets\Student_analysis\cleaned_student_exams.csv')
