{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "ff09d432-a131-4bed-9da5-ee1f466c5365",
   "metadata": {},
   "source": [
    "# **E-Commerce Sales Analysis Mini_project**"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "c2f3f8c4-39ce-4623-8164-8bb83a82452a",
   "metadata": {},
   "source": [
    "**Business Problem**\n",
    "\n",
    " An e-commerce store in Kenya wants to boost sales by understanding which products and regions\n",
    " perform best and when sales peak. \n",
    " Questions:\n",
    " \n",
    " 1.Which products/categories generate the most money?\n",
    " \n",
    " 2.Which regions buy the most?\n",
    " \n",
    " 3.Are there sales trends over time?"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "e850fd5a-6308-454f-86de-1e001a9a4a58",
   "metadata": {},
   "outputs": [],
   "source": [
    "#Importing necessary  liralies for the project\n",
    "import pandas as pd\n",
    "import seaborn as sns\n",
    "import matplotlib.pyplot as plt"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "id": "4bcc73c8-47e6-4308-a01a-af3666a64440",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1.Preview from head \n",
      " \n",
      "   order_id     product     category     price  quantity        date  \\\n",
      "0        1      Laptop  Electronics  $999.99        1.0  01/01/2025   \n",
      "1        2  Headphones   electronic     49.99       2.0   01-Jan-25   \n",
      "2        3     T-shirt     Clothing       NaN       3.0  01/02/2025   \n",
      "3        4  Smartphone  Electronics    699.99      -1.0  01/02/2025   \n",
      "4        5       Jeans     Clothing     39.99       2.0  01/03/2025   \n",
      "\n",
      "  customer_id   region  \n",
      "0        C001  Nairobi  \n",
      "1         NaN  Mombasa  \n",
      "2        C003   Kisumu  \n",
      "3        C001  Nairobi  \n",
      "4        C004      NaN   \n",
      " \n",
      " 2. Preview from tail \n",
      " \n",
      "     order_id product     category   price  quantity        date customer_id  \\\n",
      "101       99   Mouse         Elec   29.99       1.0  02/15/2025        C079   \n",
      "102      100  Tablet  Electronics  299.99       1.0  02/15/2025         NaN   \n",
      "103       98   Jeans     Clothing   39.99      -1.0  02/14/2025        C078   \n",
      "104       99   Mouse         Elec   29.99       1.0  02/15/2025        C079   \n",
      "105      100  Tablet  Electronics  299.99       1.0  02/15/2025         NaN   \n",
      "\n",
      "      region  \n",
      "101   Kisumu  \n",
      "102  Nairobi  \n",
      "103  Eldoret  \n",
      "104   Kisumu  \n",
      "105  Nairobi  \n"
     ]
    }
   ],
   "source": [
    "#load in the data in a data frame\n",
    "df=pd.read_csv(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\Raw_datasets\\Mini_Projects_datasets\\ecommerce_sales .csv')\n",
    "print(\"1.Preview from head \\n \\n\",df.head(),\"\\n \\n 2. Preview from tail\", \"\\n \\n\", df.tail() ) # loaded data preview\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "cd81c2ce-2dd8-46ff-853b-e3e54d59ba81",
   "metadata": {},
   "source": [
    "**Checking issues to clean**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "id": "9bf13e02-2504-45e4-84e6-13c5886619fe",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "identify all collumns \n",
      " \n",
      "  Index(['order_id', 'product', 'category', 'price', 'quantity', 'date',\n",
      "       'customer_id', 'region'],\n",
      "      dtype='object')\n"
     ]
    }
   ],
   "source": [
    "print(\"identify all collumns \\n \\n \", df.columns) # identify all collumns"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "f6a5f1c4-d7a9-4411-81ee-fc1c2b4d45c6",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "identify all unique collumns \n",
      " \n",
      "  Index(['order_id', 'product', 'category', 'price', 'quantity', 'date',\n",
      "       'customer_id', 'region'],\n",
      "      dtype='object')\n"
     ]
    }
   ],
   "source": [
    "print(\"identify all unique collumns \\n \\n \", df.columns.unique()) # identify all collumns"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "8d8d0bb2-92ee-4b0a-99dd-9c49d55ece52",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "check for duplicated columns  if true means all columns are the same with unique columns \n",
      " \n",
      " [ True  True  True  True  True  True  True  True]\n"
     ]
    }
   ],
   "source": [
    "print(\"check for duplicated columns  if true means all columns are the same with unique columns \\n \\n\", df.columns==df.columns.unique()) # check for duplicated columns"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "id": "18f323a5-fc7b-4302-a775-e6a18d881bcf",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "\n",
      " checking all unique collumns \n",
      "  Index(['order_id', 'product', 'category', 'price', 'quantity', 'date',\n",
      "       'customer_id', 'region'],\n",
      "      dtype='object')\n",
      "\n",
      " This shows all unique items in each collumn \n",
      "  1.order_id \n",
      " ['1' '2' '3' '4' '5' '6' '7' '8' '9' '10' '11' '12' '13' '14' '15' '16'\n",
      " '17' '18' '19' '20' '21' '22' '23' '24' '25' '26' '27' '28' '29' '30'\n",
      " '31' '32' '33' '34' '35' '36' '37' '38' '39' '40' '41' '42' '43' '44'\n",
      " '45' '46' '47' '48' '49' '50' '51' '52' '53' '54' nan 'asa' 'Mombasa'\n",
      " '55' '56' '57' '58' '59' '60' '61' '62' '63' '64' '65' '66' '67' '68'\n",
      " '69' '70' '71' '72' '73' '74' '75' '76' '77' '78' '79' '80' '81' '82'\n",
      " '83' '84' '85' '86' '87' '88' '89' '90' '91' '92' '93' '94' '95' '96'\n",
      " '97' '98' '99' '100']\n",
      "\n",
      " \n",
      "  2.product \n",
      " ['Laptop' 'Headphones' 'T-shirt' 'Smartphone' 'Jeans' 'Mouse' 'Shirt'\n",
      " 'Tablet' 'Shoes' 'Keyboard' 'Speaker' 'Jacket' 'Charger' 'Smartwatch'\n",
      " 'Monitor' nan]\n",
      "\n",
      "  \n",
      "  3.category \n",
      " ['Electronics' 'electronic' 'Clothing' 'Elec' 'clothing' nan]\n",
      "\n",
      " \n",
      "  4.price \n",
      " ['$999.99 ' '49.99' nan '699.99' '39.99' '29.99' '24.99' '299.99' '59.99'\n",
      " '89.99' '79.99' '199.99' '149.99' '19.99' '9999.99']\n",
      "\n",
      "  \n",
      "  5.quantity \n",
      " [  1.   2.   3.  -1. 999.   0.  -2.  nan]\n",
      "\n",
      "  \n",
      "  6.date \n",
      " ['01/01/2025' '01-Jan-25' '01/02/2025' '01/03/2025' 'Invalid' '01/04/2025'\n",
      " '01/05/2025' '01/06/2025' '01/07/2025' '02-Jan-25' '01/08/2025'\n",
      " '01/09/2025' '01/10/2025' '01/11/2025' '01/12/2025' '01/13/2025'\n",
      " '01/14/2025' '01/15/2025' '01/16/2025' '01/17/2025' '01/18/2025'\n",
      " '01/19/2025' '01/20/2025' '01/21/2025' '01/22/2025' '01/23/2025'\n",
      " '01/24/2025' '01/25/2025' nan '01/26/2025' '01/27/2025' '01/28/2025'\n",
      " '01/29/2025' '01/30/2025' '01/31/2025' '02/01/2025' '02/02/2025'\n",
      " '02/03/2025' '02/04/2025' '02/05/2025' '02/06/2025' '02/07/2025'\n",
      " '02/08/2025' '02/09/2025' '02/10/2025' '02/11/2025' '02/12/2025'\n",
      " '02/13/2025' '02/14/2025' '02/15/2025']\n",
      "\n",
      " \n",
      "  7.customer_id \n",
      " ['C001' nan 'C003' 'C004' 'C005' 'C002' 'C007' 'C008' 'C009' 'C010' 'C011'\n",
      " 'C012' 'C013' 'C014' 'C015' 'C016' 'C017' 'C018' 'C019' 'C020' 'C021'\n",
      " 'C022' 'C023' 'C024' 'C025' 'C026' 'C027' 'C028' 'C029' 'C030' 'C031'\n",
      " 'C032' 'C033' 'C034' 'C035' 'C036' 'C037' 'C038' 'C039' 'C040' 'C041'\n",
      " 'C042' 'C043' 'C044' 'C045' 'C046' 'C047' 'C048' 'C049' 'C050' 'C051'\n",
      " 'C052' 'C053' 'C054' 'C055' 'C056' 'C057' 'C058' 'C059' 'C060' 'C061'\n",
      " 'C062' 'C063' 'C064' 'C065' 'C066' 'C067' 'C068' 'C069' 'C070' 'C071'\n",
      " 'C072' 'C073' 'C074' 'C075' 'C076' 'C077' 'C078' 'C079']\n",
      "\n",
      "  \n",
      "  8.region v ['Nairobi' 'Mombasa' 'Kisumu' nan 'Unknown' 'Eldoret' 'Mombasa困境']\n"
     ]
    }
   ],
   "source": [
    "# check all unique data in each collumn collumn\n",
    "print(\"\\n checking all unique collumns \\n \",df.columns.unique())\n",
    "print (\"\\n This shows all unique items in each collumn \\n \",'1.order_id \\n',df['order_id'].unique())\n",
    "print (\"\\n \\n \",'2.product \\n',df['product'].unique())\n",
    "print (\"\\n  \\n \",'3.category \\n',df['category'].unique())\n",
    "print (\"\\n \\n \",'4.price \\n',df['price'].unique())\n",
    "print (\"\\n  \\n \",'5.quantity \\n',df['quantity'].unique())\n",
    "print (\"\\n  \\n \",'6.date \\n',df['date'].unique())\n",
    "print (\"\\n \\n \",'7.customer_id \\n',df['customer_id'].unique())\n",
    "print (\"\\n  \\n \",'8.region v',df['region'].unique())"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "138271d8-662e-491a-a12d-33624d316227",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "id": "0d265450-2496-4076-bc0f-9ed8690302bc",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      " chcking total nulls in every column \n",
      " \n",
      "   order_id        1\n",
      "product         3\n",
      "category        3\n",
      "price          11\n",
      "quantity        3\n",
      "date            3\n",
      "customer_id    23\n",
      "region          4\n",
      "dtype: int64\n"
     ]
    }
   ],
   "source": [
    "print(\" chcking total nulls in every column \\n \\n  \", df.isnull().sum())"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "id": "e14a9d81-cc8a-440b-b1a5-665d00be3e17",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "checking total duplicate rows\n",
      " \n",
      " 3\n"
     ]
    }
   ],
   "source": [
    "print(\"checking total duplicate rows\\n \\n\", df.duplicated().sum()) # checking total duplicate rows"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "61100661-3a06-42a2-bade-9fa768f99576",
   "metadata": {},
   "source": [
    "**cleaning**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "id": "92b4e57d-01d5-4cce-8982-dab877def9bc",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "count all nulls in price \n",
      "  0\n",
      "Check data type of price \n",
      " float64\n"
     ]
    }
   ],
   "source": [
    "# Clean price \n",
    "df['price'] = df['price'].replace('N/A', '')  # Remove N/A \n",
    "df['price'] = df['price'].replace('[\\$,]', '',regex=True)  # Remove $\n",
    "df['price'] = df['price'].astype(float)  # Make number \n",
    "avg_price = df['price'].mean()  # Get average \n",
    "df['price'] = df['price'].fillna(avg_price)  # Fill missing \n",
    "print('count all nulls in price \\n ', df['price'].isnull().sum())# count all nulls in price\n",
    "print('Check data type of price \\n',df['price'].dtype)\n",
    "df['price']=round((df['price']),0)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 10,
   "id": "a182c078-4f6a-4e31-a132-4d11e4a3bbd9",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1.checking all unique order IDS \n",
      "  \n",
      " [  1.   2.   3.   4.   5.   6.   7.   8.   9.  10.  11.  12.  13.  14.\n",
      "  15.  16.  17.  18.  19.  20.  21.  22.  23.  24.  25.  26.  27.  28.\n",
      "  29.  30.  31.  32.  33.  34.  35.  36.  37.  38.  39.  40.  41.  42.\n",
      "  43.  44.  45.  46.  47.  48.  49.  50.  51.  52.  53.  54.  nan  55.\n",
      "  56.  57.  58.  59.  60.  61.  62.  63.  64.  65.  66.  67.  68.  69.\n",
      "  70.  71.  72.  73.  74.  75.  76.  77.  78.  79.  80.  81.  82.  83.\n",
      "  84.  85.  86.  87.  88.  89.  90.  91.  92.  93.  94.  95.  96.  97.\n",
      "  98.  99. 100.] \n",
      "  \n",
      "\n",
      "2.counting values and frequency of appearances \n",
      "  \n",
      " order_id\n",
      "100.0    2\n",
      "99.0     2\n",
      "98.0     2\n",
      "63.0     1\n",
      "73.0     1\n",
      "        ..\n",
      "31.0     1\n",
      "30.0     1\n",
      "29.0     1\n",
      "28.0     1\n",
      "51.0     1\n",
      "Name: count, Length: 100, dtype: int64 \n",
      "  \n",
      "\n",
      "3.counting a specific value \n",
      "  \n",
      " 2 \n",
      "  \n",
      "\n",
      "4.counting all Nulls  \n",
      "  \n",
      " 3 \n",
      "  \n",
      "\n",
      "Checking  order id with 0 \n",
      " 3\n",
      "Order Id is ok now \n"
     ]
    }
   ],
   "source": [
    "# order id cleaning \n",
    "df['order_id']=pd.to_numeric(df['order_id'], errors='coerce')\n",
    "print ('1.checking all unique order IDS \\n  \\n', df['order_id'].unique(),'\\n  \\n')\n",
    "print ('2.counting values and frequency of appearances \\n  \\n', df['order_id'].value_counts(),'\\n  \\n')\n",
    "print ('3.counting a specific value \\n  \\n', (df['order_id']==100).sum(),'\\n  \\n')\n",
    "print ('4.counting all Nulls  \\n  \\n', df['order_id'].isna().sum(),'\\n  \\n')\n",
    "df['order_id'] = df['order_id'].fillna(0) \n",
    "print ('Checking  order id with 0 \\n',(df['order_id']==0).sum())\n",
    "print(\"Order Id is ok now \")"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "a3059717-c0db-4f5f-b973-9a847dcb434c",
   "metadata": {},
   "source": [
    "**Dealing with duplicates by dropping them**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 11,
   "id": "3f7ea256-1b4d-427d-8246-825c6eba8a89",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Here are all duplicated rows \n",
      " 0\n"
     ]
    }
   ],
   "source": [
    "\n",
    "df = df.drop_duplicates() \n",
    "print('Here are all duplicated rows \\n',df.duplicated().sum())"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 12,
   "id": "5aa5f675-c73d-4025-a561-1f6ebc67ba6e",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Fix quantity \n",
    "df.loc[df['quantity'] < 0, 'quantity'] = 0 \n",
    "df['quantity']=df['quantity'].replace(0,1)\n",
    "df['quantity']=df['quantity'].replace(999,1)\n",
    "df['quantity']=df['quantity'].dropna()\n",
    "df['quantity']=round((df['quantity']),0)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 13,
   "id": "a5b9fc13-3f48-4f31-bebd-a196ff61553f",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Fix category \n",
    "df['category'] = df['category'].str.lower() \n",
    "df['category'] = df['category'].replace(['elec', 'electronic'], 'electronics') \n",
    "df['category'] = df['category'].replace('clothing', 'clothing') "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 14,
   "id": "7908d895-61cc-4750-bc55-f82968d46157",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Fix date\n",
    "df['date'] = pd.to_datetime(df['date'], errors='coerce', format='mixed') \n",
    "most_common_date = df['date'].mode()[0] \n",
    "df['date'] = df['date'].fillna(most_common_date) "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 15,
   "id": "f585e80a-df82-4f93-9463-7994a45b242b",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Fix region \n",
    "df['region'] = df['region'].replace(['', 'Unknown'], 'Nairobi') \n",
    "df['region']=df['region'].replace('Mombasa困境','Mombasa')"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "c813bdc2-8eb9-427f-8045-6f864afb81e1",
   "metadata": {},
   "source": [
    "**Drop every  nan row**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 16,
   "id": "6cdb4602-8746-40ca-810c-59af3ac90e03",
   "metadata": {},
   "outputs": [],
   "source": [
    "df=df.dropna()"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "870ef577-e0eb-4a8b-8f6f-151fc5e2a5e3",
   "metadata": {},
   "source": [
    "## **Final checks**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 17,
   "id": "6a70f142-833e-46d3-82e7-7d32a5652a41",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "\n",
      " checking all unique collumns \n",
      "  Index(['order_id', 'product', 'category', 'price', 'quantity', 'date',\n",
      "       'customer_id', 'region'],\n",
      "      dtype='object')\n",
      "\n",
      " This shows all unique items in each collumn \n",
      "  1.order_id \n",
      " [ 1.  3.  4.  6.  7.  9. 10. 11. 12. 14. 15. 16. 18. 19. 20. 21. 22. 23.\n",
      " 25. 26. 27. 28. 29. 31. 32. 33. 34. 36. 37. 38. 39. 40. 42. 43. 44. 45.\n",
      " 46. 47. 49. 50. 51. 53. 54. 55. 57. 58. 59. 60. 62. 63. 64. 66. 67. 68.\n",
      " 69. 71. 72. 73. 74. 75. 76. 78. 79. 80. 81. 82. 84. 85. 86. 87. 88. 89.\n",
      " 91. 92. 93. 94. 96. 97. 98. 99.]\n",
      "\n",
      " \n",
      "  2.product \n",
      " ['Laptop' 'T-shirt' 'Smartphone' 'Mouse' 'Shirt' 'Shoes' 'Keyboard'\n",
      " 'Speaker' 'Charger' 'Smartwatch' 'Monitor' 'Headphones' 'Jeans' 'Tablet'\n",
      " 'Jacket']\n",
      "\n",
      "  \n",
      "  3.category \n",
      " ['electronics' 'clothing']\n",
      "\n",
      " \n",
      "  4.price \n",
      " [ 1000.   568.   700.    30.    25.    60.    40.    90.   200.   150.\n",
      "    50. 10000.   300.    80.    20.]\n",
      "\n",
      "  \n",
      "  5.quantity \n",
      " [1. 3. 2.]\n",
      "\n",
      "  \n",
      "  6.date \n",
      " <DatetimeArray>\n",
      "['2025-01-01 00:00:00', '2025-01-02 00:00:00', '2025-01-04 00:00:00',\n",
      " '2025-01-05 00:00:00', '2025-01-06 00:00:00', '2025-01-07 00:00:00',\n",
      " '2025-01-08 00:00:00', '2025-01-09 00:00:00', '2025-01-10 00:00:00',\n",
      " '2025-01-11 00:00:00', '2025-01-12 00:00:00', '2025-01-13 00:00:00',\n",
      " '2025-01-14 00:00:00', '2025-01-15 00:00:00', '2025-01-16 00:00:00',\n",
      " '2025-01-17 00:00:00', '2025-01-18 00:00:00', '2025-01-19 00:00:00',\n",
      " '2025-01-20 00:00:00', '2025-01-21 00:00:00', '2025-01-22 00:00:00',\n",
      " '2025-01-23 00:00:00', '2025-01-24 00:00:00', '2025-01-25 00:00:00',\n",
      " '2025-01-26 00:00:00', '2025-01-27 00:00:00', '2025-01-28 00:00:00',\n",
      " '2025-01-29 00:00:00', '2025-01-30 00:00:00', '2025-01-31 00:00:00',\n",
      " '2025-02-01 00:00:00', '2025-02-02 00:00:00', '2025-02-03 00:00:00',\n",
      " '2025-02-04 00:00:00', '2025-02-05 00:00:00', '2025-02-06 00:00:00',\n",
      " '2025-02-07 00:00:00', '2025-02-08 00:00:00', '2025-02-09 00:00:00',\n",
      " '2025-02-10 00:00:00', '2025-02-11 00:00:00', '2025-02-12 00:00:00',\n",
      " '2025-02-13 00:00:00', '2025-02-14 00:00:00', '2025-02-15 00:00:00']\n",
      "Length: 45, dtype: datetime64[ns]\n",
      "\n",
      " \n",
      "  7.customer_id \n",
      " ['C001' 'C003' 'C005' 'C002' 'C007' 'C008' 'C009' 'C010' 'C011' 'C012'\n",
      " 'C013' 'C014' 'C015' 'C016' 'C017' 'C018' 'C019' 'C020' 'C021' 'C022'\n",
      " 'C023' 'C024' 'C025' 'C026' 'C027' 'C028' 'C029' 'C030' 'C031' 'C032'\n",
      " 'C033' 'C034' 'C035' 'C036' 'C037' 'C038' 'C039' 'C040' 'C041' 'C042'\n",
      " 'C043' 'C044' 'C045' 'C046' 'C047' 'C048' 'C049' 'C050' 'C051' 'C052'\n",
      " 'C053' 'C054' 'C055' 'C056' 'C057' 'C058' 'C059' 'C060' 'C061' 'C062'\n",
      " 'C063' 'C064' 'C065' 'C066' 'C067' 'C068' 'C069' 'C070' 'C071' 'C072'\n",
      " 'C073' 'C074' 'C075' 'C076' 'C077' 'C078' 'C079']\n",
      "\n",
      "  \n",
      "  8.region v ['Nairobi' 'Kisumu' 'Mombasa' 'Eldoret']\n"
     ]
    }
   ],
   "source": [
    "# check all unique data in each collumn collumn\n",
    "print(\"\\n checking all unique collumns \\n \",df.columns.unique())\n",
    "print (\"\\n This shows all unique items in each collumn \\n \",'1.order_id \\n',df['order_id'].unique())\n",
    "print (\"\\n \\n \",'2.product \\n',df['product'].unique())\n",
    "print (\"\\n  \\n \",'3.category \\n',df['category'].unique())\n",
    "print (\"\\n \\n \",'4.price \\n',df['price'].unique())\n",
    "print (\"\\n  \\n \",'5.quantity \\n',df['quantity'].unique())\n",
    "print (\"\\n  \\n \",'6.date \\n',df['date'].unique())\n",
    "print (\"\\n \\n \",'7.customer_id \\n',df['customer_id'].unique())\n",
    "print (\"\\n  \\n \",'8.region v',df['region'].unique())"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "bbcad956-17de-41d1-8713-4161a5403eea",
   "metadata": {},
   "source": [
    "**Save csv**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 18,
   "id": "3a16d99e-8d38-4ce1-b6a6-e3832c544ce5",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Saved successfuly\n"
     ]
    }
   ],
   "source": [
    "df.to_csv(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\cleaned_data_sets\\E-commerse_miniproject\\cleaned_E-Commerce Sales_mini.csv')\n",
    "print(\"Saved successfuly\")"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "47f17eff-2403-45bf-8118-2586fc26c1f7",
   "metadata": {},
   "source": [
    "## **Analysis**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 19,
   "id": "eb9f8a7b-5790-4228-a848-0489a0a45d51",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Total Revenue: KSh 58730.0\n",
      "Revenue by Group:\n",
      "        product     category   region  revenue\n",
      "0      Charger  electronics  Nairobi   3976.0\n",
      "1   Headphones  electronics  Mombasa    250.0\n",
      "2       Jacket     clothing  Eldoret    640.0\n",
      "3        Jeans     clothing  Eldoret    480.0\n",
      "4     Keyboard  electronics  Mombasa     40.0\n",
      "5     Keyboard  electronics  Nairobi    400.0\n",
      "6       Laptop  electronics  Nairobi  45000.0\n",
      "7      Monitor  electronics   Kisumu   1800.0\n",
      "8      Monitor  electronics  Nairobi    300.0\n",
      "9        Mouse  electronics   Kisumu    210.0\n",
      "10       Mouse  electronics  Mombasa     30.0\n",
      "11       Shirt     clothing   Kisumu     50.0\n",
      "12       Shoes     clothing  Mombasa    360.0\n",
      "13       Shoes     clothing  Nairobi     60.0\n",
      "14  Smartphone  electronics  Nairobi    700.0\n",
      "15  Smartwatch  electronics  Mombasa   1200.0\n",
      "16     Speaker  electronics  Eldoret     90.0\n",
      "17     Speaker  electronics   Kisumu    360.0\n",
      "18     T-shirt     clothing   Kisumu   1704.0\n",
      "19     T-shirt     clothing  Nairobi    180.0\n",
      "20      Tablet  electronics  Nairobi    900.0\n"
     ]
    }
   ],
   "source": [
    " # Calculate revenue \n",
    "df['revenue'] = df['price'] * df['quantity'] \n",
    "# Total revenue \n",
    "total_revenue = df['revenue'].sum() \n",
    "# Revenue by group \n",
    "# Daily sales \n",
    "group_revenue = df.groupby(['product', 'category', 'region'])['revenue'].sum().reset_index() \n",
    "daily_sales = df.groupby('date')['revenue'].sum().reset_index() \n",
    "print('Total Revenue: KSh', total_revenue) \n",
    "print('Revenue by Group:\\n', group_revenue)"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "1eca92ba-696b-4499-ba99-e6618a3b986c",
   "metadata": {},
   "source": [
    "## **Visualization**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 26,
   "id": "fdad0178-d9c4-4767-a9ae-0c579205b905",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "image/png": "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orxGfzBq1CgJCAiQHj16uJdxXHzn+PHj0qpVK7PvU6VKJWXKlJFNmza579fhGYMHD5acOXOa++vUqSN79+71auPChQvSsmVLMydmxowZpV27dnLt2jWvdbZv3y5PPfWUef/TyeA//PDDRHuNNgoPD5dBgwZJwYIFzX4vVKiQDB8+3OtUoBybxLF69Wp54YUXzKT/+t41d+5cr/sT8zj8+OOPUrx4cbOO/l9duHChWEMHe8FeM2fOdFKkSOF89913zs6dO5327ds7GTNmdE6fPu3rTfMbdevWdSZNmuT88ccfztatW50GDRo4+fLlc65du+Zep2PHjk7evHmd5cuXO5s2bXKeeOIJp3r16u77796965QuXdqpU6eO8/vvvzsLFy50smbN6vTv39+9zoEDB5zUqVM7PXv2dP7880/nq6++cgIDA51//etfif6abbNhwwanQIECTtmyZZ3u3bu7l3NcfOPChQtO/vz5nbZt2zrr1683+3Dx4sXOvn373OuMGjXKyZAhgzN37lxn27ZtzosvvugULFjQuXHjhnudevXqOeXKlXN+++03Z82aNU7hwoWdFi1auO+/fPmykz17dqdly5bm/+eMGTOcVKlSOePGjUv012yLESNGOFmyZHHmz5/vHDx40Pnxxx+dtGnTOl988YV7HY5N4tD3mwEDBjg//fSTfopw5syZ43V/Yh2HsLAw85724Ycfmve4gQMHOsmTJ3d27Njh2IAga7kqVao4nTt3dt8ODw93cuXK5YwcOdKn2+XPzpw5Y950Vq1aZW5funTJ/KfXPwguu3btMuv8+uuv7jesZMmSOadOnXKvM2bMGCd9+vTOrVu3zO0+ffo4pUqV8nquV1991QRpRO/q1atOkSJFnKVLlzo1a9Z0B1mOi+/07dvXefLJJ6O9/969e06OHDmcjz76yL1Mj1dwcLD5Q6v0D6oeq40bN7rXWbRokRMQEOAcP37c3P7222+dTJkyuY+V67mLFSuWQK/Mfs8//7wTGhrqteyll14yQUdxbHwjYpBNzOPwyiuvmN8LT1WrVnXeeustxwaUFljs9u3bsnnzZvN1g+epavX2r7/+6tNt82eXL18215kzZzbXegzu3LnjdRz0K5p8+fK5j4Ne69c12bNnd69Tt25dc27snTt3utfxbMO1Dsfy/rR0QEsDIu47jovv/Pzzz/L4449L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",
      "text/plain": [
       "<Figure size 700x400 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    " # Bar chart \n",
    "plt.figure(figsize=(7, 4)) \n",
    "sns.barplot(x='revenue', y='category', data=group_revenue) \n",
    "plt.title('Revenue by Category') \n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\E-comerce_mini\\/category_revenue.png')\n",
    "plt.tight_layout()\n",
    "plt.show()\n",
    "plt.close() "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 24,
   "id": "999966ca-a32e-47c9-993a-d16c21f95cf7",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "image/png": "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",
      "text/plain": [
       "<Figure size 600x300 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    "# Line chart \n",
    "plt.figure(figsize=(6, 3)) \n",
    "sns.lineplot(x='date', y='revenue', data=daily_sales) \n",
    "plt.title('Daily Sales Trend') \n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\E-comerce_minidaily_sales.png') \n",
    "plt.tight_layout()\n",
    "plt.xticks(rotation=-90)\n",
    "plt.show()\n",
    "plt.close()"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.13.2"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
