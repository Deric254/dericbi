{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "4c005fc9-f266-4f23-95ff-d1d482323dfc",
   "metadata": {},
   "source": [
    "## **Portfolio Trades Analysis**"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "9ead241c-1f30-4ac4-aaa9-c923db6f32c9",
   "metadata": {},
   "source": [
    "**A Kenyan investment firm wants to optimize its stock portfolio by understanding which stocks and\n",
    " sectors perform best and when trades peak.** \n",
    " \n",
    " **Pain Points:**\n",
    " \n",
    " 1. Which stocks/sectors generate the most trade value?\n",
    " \n",
    " 2. Which exchanges (NSE, NYSE) have higher trade volumes?\n",
    "    \n",
    " 3.  Are there trade patterns over time?"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "id": "185fa6c2-28a4-412a-a490-25f7c410b02c",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Iportant libralies \n",
    "import pandas as pd\n",
    "import matplotlib.pyplot as plt \n",
    "import seaborn as sns "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "id": "75fb97d0-4490-41f0-801a-6d01585716b7",
   "metadata": {},
   "outputs": [],
   "source": [
    "# load data frame\n",
    "df=pd.read_csv(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\Raw_datasets\\Mini_Projects_datasets\\portfolio_trades - Working_copy.csv')"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "id": "9df6f826-ca21-4bdb-ad09-f4092cf3000e",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1. Data preview first 5 rows \n",
      " \n",
      "    trade_id      stock      sector      price  shares  trade_date account_id  \\\n",
      "0        1      Apple        Tech  KSh999.99    10.0  01/01/2025       A001   \n",
      "1        2      Tesla        tech        450     5.0   01-Jan-25        NaN   \n",
      "2        3  Microsoft  Technology        NaN     8.0  01/02/2025       A003   \n",
      "3        4     Amazon        Tech     1200.5    -2.0  01/02/2025       A001   \n",
      "4        5     Google        Tech     950.75    15.0  01/03/2025       A004   \n",
      "\n",
      "  exchange account_id2  \n",
      "0      NSE        A001  \n",
      "1      NSE         NaN  \n",
      "2     NYSE        A003  \n",
      "3      NSE        A001  \n",
      "4      NaN        A004   \n",
      "\n",
      "2. Data preview first 5 rows \n",
      " \n",
      "     trade_id      stock      sector       price  shares  trade_date  \\\n",
      "99        96  Microsoft  Technology       99999    10.0  02/13/2025   \n",
      "100       97     Amazon        Tech  KSh1200.50    15.0  02/13/2025   \n",
      "101       98     Google        Tech      950.75    -3.0  02/14/2025   \n",
      "102       99      Intel  Technology       45.99    20.0  02/14/2025   \n",
      "103      100     Nvidia        tech      650.25     7.0  02/15/2025   \n",
      "\n",
      "    account_id exchange account_id2  \n",
      "99         NaN     NYSE         NaN  \n",
      "100       A074      NSE        A074  \n",
      "101       A075     NYSE        A075  \n",
      "102       A076      NSE        A076  \n",
      "103        NaN     NYSE         NaN   \n",
      "\n"
     ]
    }
   ],
   "source": [
    "print(\"1. Data preview first 5 rows \\n \\n \",df.head(),'\\n')\n",
    "print(\"2. Data preview first 5 rows \\n \\n\",df.tail(),'\\n')"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "d23596a3-8b7d-4901-b1e4-13608a239c1c",
   "metadata": {},
   "source": [
    "**Check Issues**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "4cde7169-fa52-4556-ba87-5bd52b7e200f",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1.Check all columns in the data \n",
      " \n",
      "  Index(['trade_id', 'stock', 'sector', 'price', 'shares', 'trade_date',\n",
      "       'account_id', 'exchange', 'account_id2'],\n",
      "      dtype='object') \n",
      " \n",
      "\n",
      "2.Check all unique  columns in the data \n",
      " \n",
      "  Index(['trade_id', 'stock', 'sector', 'price', 'shares', 'trade_date',\n",
      "       'account_id', 'exchange', 'account_id2'],\n",
      "      dtype='object') \n",
      " \n",
      "\n",
      "Checking if all collumns are unique \n",
      " \n",
      "  [ True  True  True  True  True  True  True  True  True]\n"
     ]
    }
   ],
   "source": [
    "print(\"1.Check all columns in the data \\n \\n \",df.columns,'\\n \\n' ) # Check all columns in the data\n",
    "print(\"2.Check all unique  columns in the data \\n \\n \",df.columns.unique() ,'\\n \\n') # Check all columns in the data\n",
    "print(\"Checking if all collumns are unique \\n \\n \", df.columns==df.columns.unique())#Did not work as intended \n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "8a4f219b-6371-4a76-af88-a309aff139e0",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "np.int64(1)"
      ]
     },
     "execution_count": 5,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "df.duplicated().sum()# Checking for duplicates"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "id": "4cb7abed-a846-41e7-bd32-7db864da788a",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "trade_id        0\n",
       "stock           1\n",
       "sector          1\n",
       "price          10\n",
       "shares          1\n",
       "trade_date      1\n",
       "account_id     25\n",
       "exchange        2\n",
       "account_id2    23\n",
       "dtype: int64"
      ]
     },
     "execution_count": 6,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "df.isnull().sum()# checking for null collumns "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 7,
   "id": "4ad749f3-1450-4f98-b587-c379455a9eb0",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1. collumn trade_id \n",
      " \n",
      "  ['1' '2' '3' '4' '5' '6' '7' '8' '9' '10' '11' '12' '15' '13' '14' '16'\n",
      " '17' '18' '19' '20' '21' '22' '23' '24' '25' '26' '27' '28' '29' '30'\n",
      " '31' '32' '33' '34' '35' '36' '37' '38' '39' '40' '41' '42' '43' '44'\n",
      " '45' '46' '47' '48' '49' '50' '51' '52' '53' '54' '55' '56' '57' 'NSE'\n",
      " '58' '59' '60' '61' '62' '63' '64' '65' '66' '67' '68' '69' '70' '71'\n",
      " '72' '73' '74' '75' '76' '77' '78' '79' '80' '81' '82' '83' '84' '85'\n",
      " '86' '87' '88' '89' '90' '91' '92' '93' '94' '95' '96' '97' '98' '99'\n",
      " '100'] \n",
      " \n",
      "\n",
      "2. collumn stock  \n",
      " \n",
      "  ['Apple' 'Tesla' 'Microsoft' 'Amazon' 'Google' 'Intel' 'Nvidia' 'Meta'\n",
      " 'Ford' 'GM' 'Toyota' 'Sony' 'Honda' 'Samsung' nan] \n",
      " \n",
      "\n",
      "3. collumn sector \n",
      " \n",
      "  ['Tech' 'tech' 'Technology' 'Auto' nan] \n",
      " \n",
      "\n",
      "4. collumn price \n",
      " \n",
      "  ['KSh999.99' '450' nan '1200.5' '950.75' '45.99' '650.25' '325' '25.99'\n",
      " '35.5' '150.75' '85.25' '999.99' '99999' 'KSh1200.50'] \n",
      " \n",
      "\n",
      "5. collumn shares \n",
      " \n",
      "  [10.  5.  8. -2. 15. 20.  7. 12. 50. 30. 25. -5. -3. nan] \n",
      " \n",
      "\n",
      "6. collumn trade_date \n",
      " \n",
      "  ['01/01/2025' '01-Jan-25' '01/02/2025' '01/03/2025' 'Invalid' '01/04/2025'\n",
      " '01/05/2025' '01/06/2025' '02-Jan-25' '01/07/2025' '01/08/2025'\n",
      " '01/09/2025' '01/10/2025' '01/11/2025' '01/12/2025' '01/13/2025'\n",
      " '01/14/2025' '01/15/2025' '01/16/2025' '01/17/2025' '01/18/2025'\n",
      " '01/19/2025' '01/20/2025' '01/21/2025' '01/22/2025' '01/23/2025'\n",
      " '01/24/2025' '01/25/2025' '01/26/2025' nan '01/27/2025' '01/28/2025'\n",
      " '01/29/2025' '01/30/2025' '01/31/2025' '02/01/2025' '02/02/2025'\n",
      " '02/03/2025' '02/04/2025' '02/05/2025' '02/06/2025' '02/07/2025'\n",
      " '02/08/2025' '02/09/2025' '02/10/2025' '02/11/2025' '02/12/2025'\n",
      " '02/13/2025' '02/14/2025' '02/15/2025'] \n",
      " \n",
      "\n",
      "7. collumn account_id \n",
      " \n",
      "  ['A001' nan 'A003' 'A004' 'A005' 'A002' 'A007' 'A008' 'A010' 'A009' 'A011'\n",
      " 'A012' 'A013' 'A014' 'A015' 'A016' 'A017' 'A018' 'A019' 'A020' 'A021'\n",
      " 'A022' 'A023' 'A024' 'A025' 'A026' 'A027' 'A028' 'A029' 'A030' 'A031'\n",
      " 'A032' 'A033' 'A034' 'A035' 'A036' 'A037' 'A038' 'A039' 'A040' 'A041'\n",
      " 'A042' 'A043' 'A044' 'A045' 'A046' 'A047' 'A048' 'A049' 'A050' 'A051'\n",
      " 'A052' 'A053' 'A054' 'A055' 'A056' 'A057' 'A058' 'A059' 'A060' 'A061'\n",
      " 'A062' 'A063' 'A064' 'A065' 'A066' 'A067' 'A068' 'A069' 'A070' 'A071'\n",
      " 'A072' 'A073' 'A074' 'A075' 'A076'] \n",
      " \n",
      "\n",
      "8. collumn exchange \n",
      " \n",
      "  ['NSE' 'NYSE' nan 'Unknown' 'NSE niña'] \n",
      " \n",
      "\n"
     ]
    }
   ],
   "source": [
    "#checking for unique data in each collumn\n",
    "print(\"1. collumn trade_id \\n \\n \",df['trade_id'].unique(),'\\n \\n')\n",
    "print(\"2. collumn stock  \\n \\n \",df['stock'].unique(),'\\n \\n')\n",
    "print(\"3. collumn sector \\n \\n \",df['sector'].unique(),'\\n \\n')\n",
    "print(\"4. collumn price \\n \\n \",df['price'].unique(),'\\n \\n')\n",
    "print(\"5. collumn shares \\n \\n \",df['shares'].unique(),'\\n \\n')\n",
    "print(\"6. collumn trade_date \\n \\n \",df['trade_date'].unique(),'\\n \\n')\n",
    "print(\"7. collumn account_id \\n \\n \",df['account_id'].unique(),'\\n \\n')\n",
    "print(\"8. collumn exchange \\n \\n \",df['exchange'].unique(),'\\n \\n')"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "12dff885-32fa-448a-851b-27b777066ebc",
   "metadata": {},
   "source": [
    "## **Cleaning**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 8,
   "id": "3bea3096-5106-4777-a487-f6e3a4b3e8bf",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>trade_id</th>\n",
       "      <th>stock</th>\n",
       "      <th>sector</th>\n",
       "      <th>price</th>\n",
       "      <th>shares</th>\n",
       "      <th>trade_date</th>\n",
       "      <th>account_id</th>\n",
       "      <th>exchange</th>\n",
       "      <th>account_id2</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>1</td>\n",
       "      <td>Apple</td>\n",
       "      <td>Tech</td>\n",
       "      <td>999.99</td>\n",
       "      <td>10.0</td>\n",
       "      <td>01/01/2025</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A001</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>2</td>\n",
       "      <td>Tesla</td>\n",
       "      <td>tech</td>\n",
       "      <td>450.00</td>\n",
       "      <td>5.0</td>\n",
       "      <td>01-Jan-25</td>\n",
       "      <td>NaN</td>\n",
       "      <td>NSE</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>4</td>\n",
       "      <td>Amazon</td>\n",
       "      <td>Tech</td>\n",
       "      <td>1200.50</td>\n",
       "      <td>-2.0</td>\n",
       "      <td>01/02/2025</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A001</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>5</td>\n",
       "      <td>Google</td>\n",
       "      <td>Tech</td>\n",
       "      <td>950.75</td>\n",
       "      <td>15.0</td>\n",
       "      <td>01/03/2025</td>\n",
       "      <td>A004</td>\n",
       "      <td>NaN</td>\n",
       "      <td>A004</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>5</th>\n",
       "      <td>6</td>\n",
       "      <td>Intel</td>\n",
       "      <td>Technology</td>\n",
       "      <td>45.99</td>\n",
       "      <td>20.0</td>\n",
       "      <td>Invalid</td>\n",
       "      <td>A005</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>A005</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>6</th>\n",
       "      <td>7</td>\n",
       "      <td>Nvidia</td>\n",
       "      <td>tech</td>\n",
       "      <td>650.25</td>\n",
       "      <td>7.0</td>\n",
       "      <td>01/04/2025</td>\n",
       "      <td>A002</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A002</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>7</th>\n",
       "      <td>8</td>\n",
       "      <td>Meta</td>\n",
       "      <td>Tech</td>\n",
       "      <td>325.00</td>\n",
       "      <td>12.0</td>\n",
       "      <td>01/04/2025</td>\n",
       "      <td>NaN</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>9</th>\n",
       "      <td>9</td>\n",
       "      <td>Ford</td>\n",
       "      <td>Auto</td>\n",
       "      <td>25.99</td>\n",
       "      <td>50.0</td>\n",
       "      <td>01/01/2025</td>\n",
       "      <td>A007</td>\n",
       "      <td>Unknown</td>\n",
       "      <td>A007</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>10</th>\n",
       "      <td>10</td>\n",
       "      <td>GM</td>\n",
       "      <td>Auto</td>\n",
       "      <td>35.50</td>\n",
       "      <td>30.0</td>\n",
       "      <td>01/05/2025</td>\n",
       "      <td>A003</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A003</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>11</th>\n",
       "      <td>11</td>\n",
       "      <td>Apple</td>\n",
       "      <td>Tech</td>\n",
       "      <td>999.99</td>\n",
       "      <td>10.0</td>\n",
       "      <td>01/01/2025</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A001</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>12</th>\n",
       "      <td>12</td>\n",
       "      <td>Toyota</td>\n",
       "      <td>Auto</td>\n",
       "      <td>150.75</td>\n",
       "      <td>15.0</td>\n",
       "      <td>01/06/2025</td>\n",
       "      <td>A008</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>A008</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>13</th>\n",
       "      <td>15</td>\n",
       "      <td>Sony</td>\n",
       "      <td>Tech</td>\n",
       "      <td>85.25</td>\n",
       "      <td>20.0</td>\n",
       "      <td>02-Jan-25</td>\n",
       "      <td>A010</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A010</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>14</th>\n",
       "      <td>13</td>\n",
       "      <td>Honda</td>\n",
       "      <td>Auto</td>\n",
       "      <td>45.99</td>\n",
       "      <td>25.0</td>\n",
       "      <td>01/06/2025</td>\n",
       "      <td>NaN</td>\n",
       "      <td>NSE</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>16</th>\n",
       "      <td>15</td>\n",
       "      <td>Sony</td>\n",
       "      <td>Tech</td>\n",
       "      <td>85.25</td>\n",
       "      <td>20.0</td>\n",
       "      <td>02-Jan-25</td>\n",
       "      <td>A010</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A010</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>17</th>\n",
       "      <td>16</td>\n",
       "      <td>Apple</td>\n",
       "      <td>Tech</td>\n",
       "      <td>999.99</td>\n",
       "      <td>12.0</td>\n",
       "      <td>01/08/2025</td>\n",
       "      <td>A011</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>A011</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>18</th>\n",
       "      <td>17</td>\n",
       "      <td>Tesla</td>\n",
       "      <td>tech</td>\n",
       "      <td>450.00</td>\n",
       "      <td>8.0</td>\n",
       "      <td>01/08/2025</td>\n",
       "      <td>NaN</td>\n",
       "      <td>NSE</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>20</th>\n",
       "      <td>19</td>\n",
       "      <td>Amazon</td>\n",
       "      <td>Tech</td>\n",
       "      <td>1200.50</td>\n",
       "      <td>10.0</td>\n",
       "      <td>01/09/2025</td>\n",
       "      <td>A013</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A013</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>21</th>\n",
       "      <td>20</td>\n",
       "      <td>Google</td>\n",
       "      <td>Tech</td>\n",
       "      <td>950.75</td>\n",
       "      <td>15.0</td>\n",
       "      <td>01-Jan-25</td>\n",
       "      <td>A014</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>A014</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>22</th>\n",
       "      <td>21</td>\n",
       "      <td>Intel</td>\n",
       "      <td>Technology</td>\n",
       "      <td>45.99</td>\n",
       "      <td>20.0</td>\n",
       "      <td>01/10/2025</td>\n",
       "      <td>A015</td>\n",
       "      <td>NSE</td>\n",
       "      <td>A015</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>23</th>\n",
       "      <td>22</td>\n",
       "      <td>Nvidia</td>\n",
       "      <td>tech</td>\n",
       "      <td>650.25</td>\n",
       "      <td>7.0</td>\n",
       "      <td>Invalid</td>\n",
       "      <td>A016</td>\n",
       "      <td>NYSE</td>\n",
       "      <td>A016</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "   trade_id   stock      sector    price  shares  trade_date account_id  \\\n",
       "0         1   Apple        Tech   999.99    10.0  01/01/2025       A001   \n",
       "1         2   Tesla        tech   450.00     5.0   01-Jan-25        NaN   \n",
       "3         4  Amazon        Tech  1200.50    -2.0  01/02/2025       A001   \n",
       "4         5  Google        Tech   950.75    15.0  01/03/2025       A004   \n",
       "5         6   Intel  Technology    45.99    20.0     Invalid       A005   \n",
       "6         7  Nvidia        tech   650.25     7.0  01/04/2025       A002   \n",
       "7         8    Meta        Tech   325.00    12.0  01/04/2025        NaN   \n",
       "9         9    Ford        Auto    25.99    50.0  01/01/2025       A007   \n",
       "10       10      GM        Auto    35.50    30.0  01/05/2025       A003   \n",
       "11       11   Apple        Tech   999.99    10.0  01/01/2025       A001   \n",
       "12       12  Toyota        Auto   150.75    15.0  01/06/2025       A008   \n",
       "13       15    Sony        Tech    85.25    20.0   02-Jan-25       A010   \n",
       "14       13   Honda        Auto    45.99    25.0  01/06/2025        NaN   \n",
       "16       15    Sony        Tech    85.25    20.0   02-Jan-25       A010   \n",
       "17       16   Apple        Tech   999.99    12.0  01/08/2025       A011   \n",
       "18       17   Tesla        tech   450.00     8.0  01/08/2025        NaN   \n",
       "20       19  Amazon        Tech  1200.50    10.0  01/09/2025       A013   \n",
       "21       20  Google        Tech   950.75    15.0   01-Jan-25       A014   \n",
       "22       21   Intel  Technology    45.99    20.0  01/10/2025       A015   \n",
       "23       22  Nvidia        tech   650.25     7.0     Invalid       A016   \n",
       "\n",
       "   exchange account_id2  \n",
       "0       NSE        A001  \n",
       "1       NSE         NaN  \n",
       "3       NSE        A001  \n",
       "4       NaN        A004  \n",
       "5      NYSE        A005  \n",
       "6       NSE        A002  \n",
       "7      NYSE         NaN  \n",
       "9   Unknown        A007  \n",
       "10      NSE        A003  \n",
       "11      NSE        A001  \n",
       "12     NYSE        A008  \n",
       "13      NSE        A010  \n",
       "14      NSE         NaN  \n",
       "16      NSE        A010  \n",
       "17     NYSE        A011  \n",
       "18      NSE         NaN  \n",
       "20      NSE        A013  \n",
       "21     NYSE        A014  \n",
       "22      NSE        A015  \n",
       "23     NYSE        A016  "
      ]
     },
     "execution_count": 8,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Clean price \n",
    "df['price'] = df['price'].replace('N/A', '')  # Remove N/A \n",
    "#df['price'] = df['price'].replace('KSh', '')  # Remove KSh \n",
    "df['price'] = df['price'].replace('[\\ KSh,]', '',regex=True)  # Remove ksh\n",
    "df['price'] = df['price'].astype(float)  # Make number \n",
    "avg_price = df['price'].mean()  # Average price \n",
    "df['price'] = df['price'].fillna(avg_price)  # Fill missing \n",
    "df = df[df['price'] <= 2000] \n",
    "df.head(20)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "id": "4c678b23-e9b5-4e73-84bc-a53a4a1ff7b5",
   "metadata": {},
   "outputs": [],
   "source": [
    "#clean accounts\n",
    "df['account_id'] = df['account_id'].fillna('Unknown') # filling nan acounts with unknown "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 10,
   "id": "b26072bd-2377-49e9-8716-c487d9bdfa8d",
   "metadata": {},
   "outputs": [],
   "source": [
    "#clean duplicates\n",
    "df = df.drop_duplicates() # dropping duplicates \n",
    "df = df.loc[:, ~df.columns.str.contains('^account_id2', case=False, regex=True)]"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 11,
   "id": "6d08e4b1-b89c-4e02-addc-2e09ee5de8af",
   "metadata": {},
   "outputs": [],
   "source": [
    "df.loc[df['shares'] < 0, 'shares'] = 0#negative shares made 0"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 12,
   "id": "cf6c4695-8206-4621-8754-de43ede319e5",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>trade_id</th>\n",
       "      <th>stock</th>\n",
       "      <th>sector</th>\n",
       "      <th>price</th>\n",
       "      <th>shares</th>\n",
       "      <th>trade_date</th>\n",
       "      <th>account_id</th>\n",
       "      <th>exchange</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>1</td>\n",
       "      <td>Apple</td>\n",
       "      <td>tech</td>\n",
       "      <td>999.99</td>\n",
       "      <td>10.0</td>\n",
       "      <td>01/01/2025</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>2</td>\n",
       "      <td>Tesla</td>\n",
       "      <td>tech</td>\n",
       "      <td>450.00</td>\n",
       "      <td>5.0</td>\n",
       "      <td>01-Jan-25</td>\n",
       "      <td>Unknown</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>4</td>\n",
       "      <td>Amazon</td>\n",
       "      <td>tech</td>\n",
       "      <td>1200.50</td>\n",
       "      <td>0.0</td>\n",
       "      <td>01/02/2025</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>5</td>\n",
       "      <td>Google</td>\n",
       "      <td>tech</td>\n",
       "      <td>950.75</td>\n",
       "      <td>15.0</td>\n",
       "      <td>01/03/2025</td>\n",
       "      <td>A004</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>5</th>\n",
       "      <td>6</td>\n",
       "      <td>Intel</td>\n",
       "      <td>tech</td>\n",
       "      <td>45.99</td>\n",
       "      <td>20.0</td>\n",
       "      <td>Invalid</td>\n",
       "      <td>A005</td>\n",
       "      <td>NYSE</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "  trade_id   stock sector    price  shares  trade_date account_id exchange\n",
       "0        1   Apple   tech   999.99    10.0  01/01/2025       A001      NSE\n",
       "1        2   Tesla   tech   450.00     5.0   01-Jan-25    Unknown      NSE\n",
       "3        4  Amazon   tech  1200.50     0.0  01/02/2025       A001      NSE\n",
       "4        5  Google   tech   950.75    15.0  01/03/2025       A004      NaN\n",
       "5        6   Intel   tech    45.99    20.0     Invalid       A005     NYSE"
      ]
     },
     "execution_count": 12,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "#Clean sector\n",
    "df['sector'] = df['sector'].str.lower()  #converting sector to lower case\n",
    "df['sector'] = df['sector'].replace('technology', 'tech') \n",
    "df.head ()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 13,
   "id": "16010276-f1d8-4e4d-ab11-58911c163fca",
   "metadata": {},
   "outputs": [],
   "source": [
    "# Fix trade_date \n",
    "df['trade_date'] = pd.to_datetime(df['trade_date'], errors='coerce', format='mixed') \n",
    "most_common_date = df['trade_date'].mode()[0] \n",
    "df['trade_date'] = df['trade_date'].fillna(most_common_date) "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 14,
   "id": "8e9b84d9-00ef-4664-a3d4-83ab98013aad",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<div>\n",
       "<style scoped>\n",
       "    .dataframe tbody tr th:only-of-type {\n",
       "        vertical-align: middle;\n",
       "    }\n",
       "\n",
       "    .dataframe tbody tr th {\n",
       "        vertical-align: top;\n",
       "    }\n",
       "\n",
       "    .dataframe thead th {\n",
       "        text-align: right;\n",
       "    }\n",
       "</style>\n",
       "<table border=\"1\" class=\"dataframe\">\n",
       "  <thead>\n",
       "    <tr style=\"text-align: right;\">\n",
       "      <th></th>\n",
       "      <th>trade_id</th>\n",
       "      <th>stock</th>\n",
       "      <th>sector</th>\n",
       "      <th>price</th>\n",
       "      <th>shares</th>\n",
       "      <th>trade_date</th>\n",
       "      <th>account_id</th>\n",
       "      <th>exchange</th>\n",
       "    </tr>\n",
       "  </thead>\n",
       "  <tbody>\n",
       "    <tr>\n",
       "      <th>0</th>\n",
       "      <td>1</td>\n",
       "      <td>Apple</td>\n",
       "      <td>tech</td>\n",
       "      <td>999.99</td>\n",
       "      <td>10.0</td>\n",
       "      <td>2025-01-01</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>1</th>\n",
       "      <td>2</td>\n",
       "      <td>Tesla</td>\n",
       "      <td>tech</td>\n",
       "      <td>450.00</td>\n",
       "      <td>5.0</td>\n",
       "      <td>2025-01-01</td>\n",
       "      <td>Unknown</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>3</th>\n",
       "      <td>4</td>\n",
       "      <td>Amazon</td>\n",
       "      <td>tech</td>\n",
       "      <td>1200.50</td>\n",
       "      <td>0.0</td>\n",
       "      <td>2025-01-02</td>\n",
       "      <td>A001</td>\n",
       "      <td>NSE</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>4</th>\n",
       "      <td>5</td>\n",
       "      <td>Google</td>\n",
       "      <td>tech</td>\n",
       "      <td>950.75</td>\n",
       "      <td>15.0</td>\n",
       "      <td>2025-01-03</td>\n",
       "      <td>A004</td>\n",
       "      <td>NaN</td>\n",
       "    </tr>\n",
       "    <tr>\n",
       "      <th>5</th>\n",
       "      <td>6</td>\n",
       "      <td>Intel</td>\n",
       "      <td>tech</td>\n",
       "      <td>45.99</td>\n",
       "      <td>20.0</td>\n",
       "      <td>2025-01-01</td>\n",
       "      <td>A005</td>\n",
       "      <td>NYSE</td>\n",
       "    </tr>\n",
       "  </tbody>\n",
       "</table>\n",
       "</div>"
      ],
      "text/plain": [
       "  trade_id   stock sector    price  shares trade_date account_id exchange\n",
       "0        1   Apple   tech   999.99    10.0 2025-01-01       A001      NSE\n",
       "1        2   Tesla   tech   450.00     5.0 2025-01-01    Unknown      NSE\n",
       "3        4  Amazon   tech  1200.50     0.0 2025-01-02       A001      NSE\n",
       "4        5  Google   tech   950.75    15.0 2025-01-03       A004      NaN\n",
       "5        6   Intel   tech    45.99    20.0 2025-01-01       A005     NYSE"
      ]
     },
     "execution_count": 14,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    " #Fix exchange \n",
    "df['exchange'] = df['exchange'].replace(['', 'Unknown'], 'NSE') \n",
    "df.head()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 15,
   "id": "952eb67b-e1d3-4059-a577-edda6db11b27",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Total Trade Value: KSh 453603.9\n",
      "Trade Value by Group:\n",
      "      stock sector exchange  trade_value\n",
      "0   Amazon   tech      NSE      66027.5\n",
      "1   Amazon   tech     NYSE      54022.5\n",
      "2    Apple   tech      NSE      55999.4\n",
      "3    Apple   tech     NYSE      47999.5\n",
      "4     Ford   auto      NSE       5198.0\n",
      "5     Ford   auto     NYSE       3898.5\n",
      "6       GM   auto      NSE       4260.0\n",
      "7       GM   auto     NYSE       3195.0\n",
      "8   Google   tech      NSE      28522.5\n",
      "9   Google   tech     NYSE      42783.8\n",
      "10   Honda   auto      NSE       1149.8\n",
      "11   Intel   tech      NSE       3679.2\n",
      "12   Intel   tech     NYSE       3679.2\n",
      "13    Meta   tech      NSE      11700.0\n",
      "14    Meta   tech     NYSE      15600.0\n",
      "15  Nvidia   tech      NSE      18207.0\n",
      "16  Nvidia   tech     NYSE      18207.0\n",
      "17    Sony   tech      NSE       6820.0\n",
      "18    Sony   tech     NYSE       5115.0\n",
      "19   Tesla   tech      NSE      16650.0\n",
      "20   Tesla   tech     NYSE      10800.0\n",
      "21  Toyota   auto      NSE       6783.8\n",
      "22  Toyota   auto     NYSE       9045.0\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "dtype('float64')"
      ]
     },
     "execution_count": 15,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "# Calculate trade value \n",
    "df['trade_value'] = df['price'] * df['shares'] \n",
    "# Total trade value \n",
    "total_value = df['trade_value'].sum() \n",
    "# Group by stock, sector, exchange \n",
    "group_value = df.groupby(['stock', 'sector', 'exchange'])['trade_value'].sum().reset_index() \n",
    "daily_trades = df.groupby('trade_date')['trade_value'].sum().reset_index() \n",
    "print('Total Trade Value: KSh', round(total_value,1)) \n",
    "print('Trade Value by Group:\\n', round(group_value,1))\n",
    "df['trade_value'].dtype"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 16,
   "id": "6d2f6394-0c9e-4979-be11-1a1082041372",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "succesfully saved \n"
     ]
    }
   ],
   "source": [
    "# Save cleaned data \n",
    "df.to_csv(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\cleaned_data_sets\\portfolio_mini/cleaned_portfolio_analysis.csv',index=False)\n",
    "print(\"succesfully saved \")"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "affd87be-732b-4c63-9a8f-bf3666562028",
   "metadata": {},
   "source": [
    "## **Visualization**"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 17,
   "id": "0933d877-5314-409f-8b1c-9f6d7bc435d7",
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "C:\\Users\\A\\AppData\\Local\\Temp\\ipykernel_9120\\736950023.py:4: FutureWarning: \n",
      "\n",
      "The `ci` parameter is deprecated. Use `errorbar=None` for the same effect.\n",
      "\n",
      "  ax=sns.barplot(x='trade_value', y='sector', data=group_value ,ci=None)\n"
     ]
    },
    {
     "data": {
      "image/png": "iVBORw0KGgoAAAANSUhEUgAAAssAAAH0CAYAAADLzGA+AAAAOnRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjEwLjEsIGh0dHBzOi8vbWF0cGxvdGxpYi5vcmcvc2/+5QAAAAlwSFlzAAAPYQAAD2EBqD+naQAANy5JREFUeJzt3QeUVdXZP+CNoIgoYK8Iit3Ye++9YI1Ygr1iicYSNYrGGDsaNfYWWfbuP1FR/DT2hoINNSoqxl7BisL817u/deebwlbAkeHeeZ61rnPnnDv37nvPMP7Oe96zT7u6urq6BAAANDNV80UAAEAQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgFSSmuvvXa+Tamuuuqq1K5du/TWW29N9tfu2bNn2nzzzSf76wJMCYRlYIoQQXBCbg8++GCakv3www9plllmSauvvnrxMXV1dal79+5p2WWXnaxj4/9888036YQTTpjif5+A1tehtQcAEAYOHNjo+6uvvjrdd999zZYvuuiiaUo29dRTp+233z5dfPHF6e233049evRo9piHHnoovfvuu+nQQw9tlTHyv2H5xBNPzPen5CMKQOsTloEpwi677NLo+yeeeCKH5abLxxd6pptuujQl2XnnndNFF12UrrvuuvTHP/6x2fprr702TTXVVKlPnz6tMj5+PV9//XXq3Llzaw8DaEHaMICqERXA3/zmN2nIkCFpzTXXzCH5mGOOyevuuOOOtNlmm6W55pordezYMfXq1SuddNJJaezYsc2e55JLLsnrO3XqlFZcccX08MMPj/f1vv/++9S/f/+0wAIL5OeM1okjjzwyL/8pq622Wu7zjVA8vjaNm2++Oa2zzjp5rM8//3zabbfd0vzzz5+mnXbaNMccc6Q99tgjffrppz/7eURbSrQSNBWvHc/Z0BdffJF+//vf5/cQ7yXe02mnnZbGjRuXJtS9996bll566TzOxRZbLN16663169588808nrPPPrvZzz322GN5Xew8/JTzzjsvLb744nm7zjjjjGn55Zdv9hn+97//zZ/P7LPPnt9HPP6KK65o9lzfffdd/mwWWmihPN4555wzbbPNNumNN97Ifd+zzjprflxUlystPg0/y//5n/9Ja6yxRg6+3bp1S717907Dhw9v9Brx+Pi5l19+Oe200055zD/VfgNUJ5VloKpEiNxkk01yVTaqzhGaKifATT/99Omwww7LXyPsHH/88WnUqFHpjDPOqP/5yy+/PO27775p1VVXzeExQt6WW26ZZpppphwkKyJExvJHHnkk7bPPPrn944UXXshh8LXXXku33357cYwRoCI8/fWvf00vvfRSDnQV99xzT/rss89y9TlE9TzGsPvuu+egHI+PMB9fo7oez/VLRfV9rbXWykEz3vu8886bA+zRRx+d3n///XTOOef87HP85z//STvssEPab7/90q677pquvPLK3G4S72eDDTbIYT92Eq655ppm7SWxbIYZZsiBs+TSSy9NBx98cNpuu+3SIYccksNu7Eg8+eST+bMMH374YVp55ZXzZ3LggQfmwHv33XenPffcM2/n2J4hdpDihMT7778//57E840ePTp/1i+++GJaf/3104UXXpj233//tPXWW+cQHZZccsn8dfDgwfl3LN5TBOJvv/02B/l4f88++2zeGWkoPocFF1wwb+/oRwdqTB3AFKhfv36ROhotW2uttfKyiy66qNnjv/nmm2bL9t1337rpppuu7rvvvsvfjxkzpm622WarW3rppeu+//77+sddcskl+Xnj+SsGDhxYN9VUU9U9/PDDjZ4zXjse++ijj/7k+F966aX8uKOPPrrR8j59+tRNO+20dV9++WVx3Nddd13+2Yceeqh+2ZVXXpmXjRgxon5ZfN+/f/9mP9+jR4+6XXfdtf77k046qa5z5851r732WqPH/fGPf6xr37593TvvvPOT7yWeL17rlltuqV8W459zzjnrlllmmfplF198cX7c8OHD65fFZz7LLLM0Gs/49O7du27xxRf/ycfsueee+TU/+eSTZp9p165d6z/LK664Io9jwIABzZ5j3Lhx+evHH39c/Pzi9yN+Tz799NP6ZcOGDcu/D3379q1fFj8bz7Hjjjv+5LiB6qYNA6gqceg9qrBNRUtFRVQRP/nkk3wYPaqqr7zySl7+zDPPpI8++ihXR6eZZpr6x0fLQteuXRs930033ZSryYssskh+rspt3XXXzesfeOCBnxxntCkss8wy6frrr2/Uz3rnnXfmqmeXLl2ajTuqqfEaUT0NUcVsCfFe4rOINoGG7yUqrFGFjRMOf060jEQVtiLG37dv3/Tcc8+lDz74IC/77W9/m1seopJcMWjQoPxa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2Km1hwEAMEUbckbfVItUlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAAAKhGUAACgQlgEAoEBYBgCAAmEZAADaSlh+6623Urt27dLQoUNbeygAAFS5Vg/La6+9dvr973/f2sMAAOAXevDBB9PCCy+cpp122rTgggumQYMG5WVRyKzcNt988/zYgQMHptlmmy0/dvnll08vv/xyXv7999+nAw44IM0yyyxp5plnzo8LvXv3Tp07d07dunVLe++9dxo7dmyz119zzTVTly5d0owzztgoX1544YVpjjnmSPPMM0+67LLLqissAwBQG7777rt09NFHp2effTZ17do17bvvvvXrRo4cmW//+Mc/8veLLLJIuvvuu9P999+fXnzxxXTuuefm5X/9619zQI7bnXfemUNu2HPPPdNzzz2X9t9//xx4n3766Wavv+yyy6aHH344B+W//e1vOai//vrr6aCDDkqHHnpovu23337pzTffrI6wvNtuu6V///vf+c1U9jaijSI+sE022SRNP/30afbZZ0+/+93v0ieffFL/c+PGjUunn356WmCBBVLHjh3TvPPOm04++eRGzx0fwjrrrJOmm266tNRSS6XHH3+8Fd4hAEDbsfHGG+d8t9hii6XlllsuffbZZ42CbFSVn3/++fz9CiuskB8TFeipp546Lbroonn5tddem37729/mLLjaaqulDTbYIC/fcsst00ILLZS6d++eM2J8beqcc87JuW/DDTfM38frR8COKvRmm22WnyPuR0CvirAcIXmVVVbJpfT3338/32aYYYa07rrrpmWWWSY988wz6Z577kkffvhh/tAqYo/l1FNPTccdd1wu2ceHGqG6oWOPPTYdfvjhuXc5Ptgdd9wx/fjjj8WxRMl/1KhRjW4AAEy8KHxec801aZ999smh9rbbbsstGVHkjExWV1eXHxf355xzzhx+o8gZovr8xBNP5OURpiMPhi+//DIXQfv165fWW2+9NOuss473tX/44Yd0/PHHpx49euTQXKlMR2aMcYWGIX6KDstRnp9mmmnyG483ErfoKYmgHCX4KM/H/SuuuCI98MAD6bXXXkujR4/OITsqy7vuumvq1atXWn311dNee+3V6LkjKMceRATlE088Mb399tu5DF9yyimn5PFUbuPbWwEA4Kf95z//ydXgNdZYIxc3I6tttdVWOdP16dMnF0ErHQNnn3127jKIroEodIaZZpopTTXVVOmWW25JX331VW6hCFFQjSJoZMA77rgj/b//9/+avXZUjXfZZZc0ZMiQvD5CeIwjiq7x2pW8GL3LVduzPGzYsByM481VbhGawxtvvJGGDx+eq8CxR/FTllxyyfr7sWcSPvroo+Ljo1odeyyVW+zVAAAw4SI/rb/++vnEvehB/uCDD3KF+eabb84Z7tZbb83dAHHyXgTeCM1RNG3fvn3q1KlTfo4I2pXv42sUViObxc82fFzla6h0BEQYvv3223NPc5zkV1l+yCGH5JbcKKZGUXTTTTed4PfUIU1hYg9iiy22SKeddlqzdRF6J7QhO3pfKqIXOsReS0kcFogbAACT5v7770/vvPNOvsXR/TBgwIAcnKPdNvqTb7jhhpzNBg8enM9Li3wW/cvRVRAiA8by6ByIgml0FEQrbbTfRg6M2TAOO+yw3NMcHQfhrLPOylXqq666Kn+/7bbb5q/9+/dPJ5xwQm75jaJrzNQRIT2CdNWE5dhbaDj1RzR/R9m9Z8+eqUOH5sOLDzn2JGJjNG29AACg9ey222751lTMQtHUeeedl29NRVvufffd12x5VKZLouU2VHqhm3rppZfSpGr1NowIxU8++WSeBSNK8dG0HU3X0fAdU4LEXkA0hO++++45VMdcfEcddVQ68sgj09VXX53XRxP45Zdf3tpvBQCAGtPqYTl6R6L/JKYYibMax4wZkx599NEcjOMMxiWWWCLPlRcl92j2DlGG/8Mf/pDPdIxpRnbYYYef7EcGAIBJ0a6uVK9u46IhPBrAlzrootS+4/81kAMA0NyQM/qm1sprcQJgXLmvJivLAAAwpRKWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgQFgGAIACYRkAAAqEZQAAKBCWAQCgoEOaSD/88EPq1KlTGjp0aPrNb36Tat1Df9kxdenSpbWHAQBANVSWp5566jTvvPOmsWPH/jojAgCAam7DOPbYY9MxxxyTPvvss5YfEQAAVGsbRjj//PPT66+/nuaaa67Uo0eP1Llz50brn3322ZYaHwAAVFdY3mqrrVp+JAAAMIVpV1dXV9fag5gSjRo1KnXt2jV9+eWXTvADAGijeW2SKssVQ4YMScOHD8/3F1988bTMMsu01LgAAKDVTVJY/uijj1KfPn3Sgw8+mLp165aXffHFF2mdddZJ119/fZp11llbepwAAFAds2EcdNBBafTo0emll17KM2LE7cUXX8yl8IMPPrjlRwkAANXSsxy9IYMHD04rrLBCo+VPPfVU2nDDDXOVudrpWQYAmLJNjrw2SZXlcePG5YuTNBXLYh0AANSCSQrL6667bjrkkEPSe++9V7/sv//9bzr00EPTeuut15LjAwCA6grLcVGSKHv37Nkz9erVK9/mm2++vOy8885r+VECAEC1zIbRvXv3fJW+6Ft+5ZVX8rJFF100rb/++i09PgAAqK4T/K6++uq0ww47pI4dOzZaPmbMmDx1XN++fVO1c4IfAMCUbXLktUkKy+3bt0/vv/9+mm222Rot//TTT/OysWPHpmonLAMATNmm2NkwIl+3a9eu2fJ33303DxgAANpcz3JczjpCctxi1osOHf7vx6OaPGLEiLTxxhv/GuMEAIApOyxvtdVW+evQoUPTRhttlKaffvr6ddNMM02eHWPbbbdt+VECAMCUHpb79++fv0Yo7tOnT7MT/AAAoJZMUs/yYostlqvLTT355JPpmWeeaYlxAQBAdYblfv36pZEjRzZbHlfxi3UAANBmw/LLL7+cll122fGeABjrAACgzYbl6FX+8MMPmy2PuZcbzpABAADVbJLC8oYbbpiOPvroPAF0xRdffJGOOeaYtMEGG7Tk+AAAoNVMUhn4zDPPTGuuuWbq0aNHbr0IccLf7LPPngYOHNjSYwQAgOoJy3PPPXd6/vnn0zXXXJOGDRuWOnXqlHbfffe04447pqmnnrrlRwkAAK1gkhuMO3funPbZZ5+WHQ0AAFR7z3KIdovVV189zTXXXOntt9/Oy84+++x0xx13tOT4AACgusLyhRdemA477LC0ySabpM8//zyNHTs2L59xxhnTOeec09JjBACA6gnL5513Xrr00kvTscce22iquOWXXz698MILLTk+AACorrA8YsSI+lkwms6//PXXX7fEuAAAoDrD8nzzzZenimvqnnvuSYsuumhLjAsAAKpzNozoV+7Xr1/67rvvUl1dXXrqqafSddddl0455ZR02WWXtfwoAQCgWsLyXnvtledW/tOf/pS++eabtNNOO+W5l//2t7+lPn36tPwoAQCgWsLyt99+m7beeuu0884757D84osvpkcffTTNM888LT9CAACopp7l3r17p6uvvjrfHzNmTNpyyy3TgAED0lZbbZWnlQMAgDYblp999tm0xhpr5Ps333xzmn322fOFSSJAn3vuuS09RgAAqJ42jGi9mGGGGfL9e++9N22zzTZpqqmmSiuvvHL91fxqxZp/ui6179iptYfBRBpyRt/WHgIA0FYrywsssEC6/fbb08iRI9OgQYPShhtumJd/9NFHqUuXLi09RgAAqJ6wfPzxx6fDDz889ezZM6200kpplVVWqa8yj+9iJQAA0GbaMLbbbru0+uqrp/fffz8ttdRS9cvXW2+9PEsGAAC02bAc5phjjnxraMUVV2yJMQEAQPW2YQAAQFsgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFCLYfmqq65K3bp1a+1hMIW75JJLUrt27VKfPn3Sbrvtlu9XblNN9b//BIYPH55WWGGF1LVr1/y4r7/+Oi9/+umn0xJLLJFmmmmmdPDBB6exY8c2e/7SYy6//PI0zzzz5NuVV145md81AJDaeliGn/P999+nk08+OU0zzTT5+7PPPjuNHDky33r16pXWXnvtvHy//fZL7du3Tw888EAaNGhQOvPMM1NdXV3aaaed0mKLLZZuu+22dMEFF6Qbb7yx0fOXHvPWW2+lfffdNx122GH5ts8+++TXBACqS6uG5XvuuSetvvrquTo888wzp8033zy98cYbed2DDz6YK39ffPFF/eOHDh2al0UQifW77757+vLLL+urhCeccEJ+3Oeff5769u2bZpxxxjTddNOlTTbZJP3nP//52VA1atSoRjdqo6q89NJLpznnnDN/H78TUel9//338+/annvumZc/88wz+Xdx2WWXzcH33nvvzetff/31tO2226a11lorLbjggumuu+5q9PylxwwePDhXmHfZZZe08847px9//DE/JwBQXVo1LMeh7qi6RVC5//778yHxrbfeOo0bN+5nf3bVVVdN55xzTurSpUsOPnE7/PDD87o41B7Peeedd6bHH388V/823XTT9MMPPxSf75RTTsmH4Cu37t27t+h7ZfL79ttv06mnnppOOumkZuuiRSJ20iLkhjnmmCO3YsTv5IgRI9Jnn32WPv7447xu+umnr/9aWVZRekzD5ZV1TX8WAJjydWjNF68ElYorrrgizTrrrOnll1/+2Z+Nw+oRaqOiHEGnIirIEZIfffTRHKjDNddck8Pv7bffnrbffvvxPt/RRx+dg3tFVJYF5up26aWXptVWWy1XikPsNMWOWBxFuP7663PVd9ppp83rTj/99Px9/E7NMMMMafHFF8+/i2H06NH1XxdZZJFGr1F6TMPl8boNHwsAVI9WDcsRbI8//vj05JNPpk8++aS+ovzOO+/k9olJEdXBDh06pJVWWql+WbR4LLzwwnldSceOHfON2vHmm2+mm266Kd/C22+/ndsk4nch2nf22muv+sdGoH7qqafyzxx44IFpxx13TPPPP3/ua77lllvS7LPPntstjjvuuPz4d999Nx/VKD0mdtTiSMnAgQPzDl30Q6+//vqt9lkAAFXYhrHFFlvkw91RAYzAHLcwZsyY+lkKKlW58FNtFNDUH/7whzxTRdyiZ3nDDTdMBxxwQD6CEb3J0ctcceutt6aVV145n+gXbTxxi9/BOCoRRzqiPSjWxUwZIY46/PWvfy0+Zr755ksXXXRRPqFwwIAB6eKLL049evRoxU8DAKiqyvKnn36aXn311RyU11hjjbzskUceqV9fOWQdvchxUlblBL+mrRhNp/JadNFF88lUEbwrbRiV16ocjqdtiEBbaaV577336pfHjBdNHXvssfnWVByhePHFF5stb7gTV3rM3nvvnW8AQPVqtcpyBOBoj4jZCuLQ9f/8z/806hleYIEFctCJGS6iXeNf//pXOuussxo9R8+ePdNXX32VTw6MNo5vvvkmH2bv3bt3DikRvocNG5Z7Ueeee+68HAAApviwHIev4ySrIUOGpN/85jfp0EMPTWeccUb9+qmnnjpdd9116ZVXXklLLrlkOu2009Jf/vKXRs8RleM47L3DDjvkSnScpBXiAhDLLbdcnopulVVWyVXAmM4rnhMAACZUu7qGx5NpNBtGzIyw1EEXpfYdO7X2cJhIQ87o29pDAAAmU16LE/fjxPtfgyv4AQBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAgbAMAAAFwjIAABQIywAAUCAsAwBAQYfSCv7XQ3/ZMXXp0qW1hwEAQCtQWQYAgAJhGQAACoRlAAAoEJYBAKBAWAYAgAJhGQAACoRlAAAoEJYBAKBAWAYAgAJhGQAACoRlAAAoEJYBAKBAWAYAgAJhGQAACoRlAAAoEJYBAKBAWAYAgAJhGQAACjqUVrR1dXV1+euoUaNaeygAAIxHJadVctuvQVgu+PTTT/PX7t27t/ZQAAD4CaNHj05du3ZNvwZhuWCmmWbKX995551f7cNn8u55xo7PyJEjU5cuXVp7OPxCtmftsU1ri+1Ze0ZNods0KsoRlOeaa65f7TWE5YKppvrfdu4IylPSLwW/TGxL27N22J61xzatLbZn7ekyBW7TX7uo6QQ/AAAoEJYBAKBAWC7o2LFj6t+/f/5K9bM9a4vtWXts09pie9aejm14m7ar+zXn2gAAgCqmsgwAAAXCMgAAFAjLAABQICwDAECBsPwzfvjhh/T+++/nW9yn+uy4447piCOOaLRs0KBB6cQTT2x0o3r8+9//Tl9//XVx/T333JMefvjhyTomJp3tWXsX9TrggAOK6zfddNN0yimnTNYx8ctM1ca3qbBccOONN6aVV145TTfddGnuuefOt7gfy2644YbWHh4TIf4nu8UWWzRa9tVXX6Uzzzwz3XHHHemWW24RlqvMOuusk15//fXi+sceeyydccYZk3VMTDrbs7a0a9cuXXfddenAAw8sFjBuu+22yT4uJl27Nr5NheXxuOCCC9Juu+2WVlpppRykHn/88XyL+7Fs1113TX//+99be5hMoE8//TT16NGj0bKFF144X67z2WefTffff3+rjY1J/8P9U7NeLrfccmnIkCGTdUxMOtuz9tx55525GDG+cLX88sunV155pVXGxaS7sw1v0w6tPYAp0emnn54uuuii1Ldv32brttxyy/yHOybm7tevX6uMj4kz66yzpv/+97+NAnO01Uw77bT5vqnGq9Oyyy47yeGLKY/tWVsWWmih3F4TRw3Gjh2bi1CxHcOPP/6YOnXq1NpDZCIt1Ia3qbA8Hh9++GFaccUVi+tj3QcffDBZx8SkW3311fPOTRwimn766dOXX36ZTjjhhLTKKqu09tD4BQYMGJDmn3/+1h4GLcT2rD2xPaMNbu21186tcOecc07q1q1bOvroo9Oqq67a2sNjEszfRrepsDweSy+9dDr77LNzdbmy11QR1Y1Yt9RSS7Xa+Jg4J598cu41j8pyr1690muvvZZmnHHGdP311+f1HTp0SIssskhrD5OJFNUN/w5rh+1Zm+add970yCOP5J7WaH+L/4fGsnvvvbe1h8YkmnfeedOjjz6a+vTp02a2qbA8Huedd17aaKON0l133ZXWW2+9NPvss9dXnAcPHpy++eabPJsC1WG++eZLL7/8cg7H7733Xtp///3Tb3/729S5c+e8fqaZZsrrqR5x3kBsN2qD7VlbrrzyytS1a9f67+eaa658+D7+zn722We5lbGWD9m3hW0655xztqlt2q5OI9h4ffzxx+mqq67KZ2FXWi7mmGOOfOh+jz32SLPMMktrD5GJNGrUqHySUMPtGf/A40Q/qteIESMabdPYOaK6fPfdd7kHsrIDCzAlEZaped9//3069NBD0+WXX55PQphmmmny8jFjxuQWjNj5ib6rjh07tvZQmcgTcWO7RVCutEvFn7MIzIccckg66qijWnuITKCNN944LbnkknmbNpy+8+67725W3aJ6KFDUjnfffTf/P7OtnlegDYOad/jhh+f/6UYbRrTVVP5Qxx/ymDYugnRMuG46wOoRJ2hGu9Sf/vSnZq1SsU1POumkfJGLP//5z609VCbA0KFDm811HvPaxzRVcSJR7PDGv2FhuTooUNSeXXbZJa2//vr5b27FZZddlq655pr676NY8eCDD6ZapLJMzYuWmZtvvjn/T3d8ou9q2223TZ988slkHxuTJnogL7744mYXm6n45z//mfbZZ5/co86UL6ZxfPXVVxtN7/jSSy+lddddN+8ARVtc7BCNGzeuVcfJhDnooIPyv8GY4aRUoNhss80UKKpsCtZBgwY1muLxvvvuyyF65513zudyXXLJJTX7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7AIWMaPCxRdfnE/m7NevX2sPlQl0QRvfpsIyUJMXmll66aVdxKJK2J61Ja7G+Oc//zn17dt3vOvjqEH//v3zVRmpDj3b+DbVhgFUnQUXXDBdd911xfXXXHNNWmihhSbrmJh0tmdtiWrjiiuuWFwf6yoznlAdPmzj21RlGag6Ma9n79698yVYY7qipnN+Pvvss+n2229Pm2yySWsPlQlge9aWmEpsySWXTBdddFH9fNkVETn222+/fAGaJ554otXGyMRZpY1vU2EZqNrLr55//vl5FoWG8/LGH/UDDzwwLbbYYq09RCaC7Vk7nnnmmbTRRhvlk7+a9rfGXL1x0mbsBK2wwgqtPVQm0DNtfJsKywBAi/r444/TVVddlaf9a7rzs8cee6RZZpmltYfIRPq4DW9TYRkAAAqc4AcAAAXCMgAAFAjLAABQICwDAECBsAwAAAXCMgAAFAjLAFWkZ8+e6ZxzzklTit122y1ttdVWrT0MgF+NsAzQgtZee+30+9//vrWHAUALEZYBJqO4DtSPP/7Y2sMAYAIJywAt2JLw73//O/3tb39L7dq1y7e4PGx8vfvuu9Nyyy2XOnbsmB555JH0xhtvpN69e6fZZ589TT/99GmFFVZIgwcPbvR8H330Udpiiy1Sp06d0nzzzZeuueaaZq/5xRdfpL322ivNOuusqUuXLmnddddNw4YN+9mxvvbaa3lcr7zySqPlZ599durVq1e+P3bs2LTnnnvm144xLLzwwvm9TWybyNJLL51OOOGEXzxmgNYgLAO0kAiSq6yyStp7773T+++/n2/du3fP6/74xz+mU089NQ0fPjwtueSS6auvvkqbbrppuv/++9Nzzz2XNt544xyM33nnnUbhe+TIkemBBx5IN998c7rgggtygG5o++23z8sijA8ZMiQtu+yyab311kufffbZT451oYUWSssvv3yzAB7f77TTTvn+uHHj0jzzzJNuuumm9PLLL6fjjz8+HXPMMenGG2/8RZ/TpI4ZoFXUAdBi1lprrbpDDjmk/vsHHnigLv7U3n777T/7s4svvnjdeeedl++/+uqr+eeeeuqp+vXDhw/Py84+++z8/cMPP1zXpUuXuu+++67R8/Tq1avu4osv/tnXi+eJx1ZUXjNep6Rfv3512267bf33u+66a13v3r3rv+/Ro0f9+CqWWmqpuv79+7fImAEmN5VlgMkgqrgNRWX58MMPT4suumjq1q1bbsWIqnOlshz3O3TokFs3KhZZZJH82IpoXYjnmXnmmfPPV24jRozIbR4/p0+fPumtt95KTzzxRH1VOaq88ToVf//73/MYomUinvuSSy5pVP2eWL90zACTW4fJ/ooAbVDnzp0bfR9B+b777ktnnnlmWmCBBXJP8HbbbZfGjBkzwc8ZoXPOOedMDz74YLN1DUN1yRxzzJH7ha+99tq08sor56/7779//frrr78+j/Oss87K7SUzzDBDOuOMM9KTTz5ZfM6pppoqn8TY0A8//NBiYwaY3IRlgBY0zTTT5BPjfs6jjz6ae5K33nrr+hAZVd6KqO7GrBnR0xsn/4VXX301nxxXEVXgDz74IFeg48S6SbHzzjunI488Mu24447pzTffzNXmhmNcddVV0wEHHFC/7Oeqv1GBjl7tilGjRuWqcUuOGWBy0oYB0IIiAEblNYLvJ598kk+SG58FF1ww3XrrrWno0KG5NSFOqmv42Jh5Ik7623ffffPzRWiOGSSiAl2x/vrr54pvXBTk3nvvza/52GOPpWOPPTY988wzEzTebbbZJo0ePTpXlNdZZ50011xzNRpjPM+gQYPy7BnHHXdcevrpp3/y+aJSPXDgwPTwww+nF154Ie26666pffv2LTpmgMlJWAZoQdG2EOFwscUWy1XWUn/vgAED0owzzpgrtzELxkYbbZSrrg1deeWVObyutdZaOdTus88+abbZZqtfH1O/3XXXXWnNNddMu+++e57hIirDb7/9dp6SbkJEa0W8fgT2qDI3FEE9XneHHXZIK620Uvr0008bVZnH5+ijj87j3XzzzdNmm22WQ3FlKrqWGjPA5NQuzvKbrK8IAABVQmUZAAAKhGWAGrX44os3mp6t4W18VwMEoDltGAA1KvqAG07b1lD0B0e/MgA/TVgGAIACbRgAAFAgLAMAQIGwDAAABcIyAAAUCMsAAFAgLAMAQIGwDAAAafz+P0UV2PR1OsktAAAAAElFTkSuQmCC",
      "text/plain": [
       "<Figure size 800x500 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "saved successfully\n"
     ]
    }
   ],
   "source": [
    "\n",
    "# Bar chart \n",
    "#Trade value by stock \n",
    "plt.figure(figsize=(8, 5)) \n",
    "ax=sns.barplot(x='trade_value', y='sector', data=group_value ,ci=None) \n",
    "for p in ax.patches:\n",
    "    ax.text(p.get_width()+0.5,p.get_y()+p.get_height()/2,\n",
    "            f'{p.get_width():.2f}',ha='left',va='center', fontweight='bold',fontsize=6)\n",
    "plt.title('Trade Value by sector')\n",
    "plt.xticks(rotation=-90)\n",
    "plt.show()\n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\portfolio_mini\\python\\tvysector.png')\n",
    "print(\"saved successfully\")\n",
    "plt.close() "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 25,
   "id": "bd21c379-9cf7-4f02-9ec9-5f2b56474f29",
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "C:\\Users\\A\\AppData\\Local\\Temp\\ipykernel_9120\\2130869434.py:4: FutureWarning: \n",
      "\n",
      "The `ci` parameter is deprecated. Use `errorbar=None` for the same effect.\n",
      "\n",
      "  ax=sns.barplot(x='trade_value', y='stock', data=group_value ,ci=None)\n"
     ]
    },
    {
     "data": {
      "image/png": "iVBORw0KGgoAAAANSUhEUgAABAsAAAH0CAYAAABbxqTcAAAAOnRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjEwLjEsIGh0dHBzOi8vbWF0cGxvdGxpYi5vcmcvc2/+5QAAAAlwSFlzAAAPYQAAD2EBqD+naQAAds1JREFUeJzt3QmcjfX7+P9rzDDGTvaQ7Et2soYsUZaQXdkVJVSEJGsU0SZZsmeNLElRypLIEpU9W/hE2ZdkP//HdX1/9/mfezZLY86cmdfz8bibOfd9n/u8z5njdN7X+3pf7yCPx+MRAAAAAACA/yeR8wsAAAAAAIAiWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIVgAQAAAAAAcCFYAAAAAAAAXAgWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwIVgAAEA8VrVqVdviqqlTp0pQUJAcOnQo1h87Z86cUrduXUlo9PXu2rWrv5sBAIjjCBYAAHCPO2a3s61atUrismvXrkn69OmlUqVKUZ7j8Xgke/bsUrJkyVhtW1x34sQJ6d69uxQoUEDCwsIkY8aM8vDDD0vv3r3l4sWL3vNmzZol7733nl/bCgCAI8T7GwAAiHEzZsxw3Z4+fbp88803EfYXLFhQ4rLEiRNLkyZNZPz48fLHH3/IAw88EOGcNWvWyNGjR+Wll17ySxvjotOnT0vp0qXl/Pnz0r59ewsYnDp1Sn799Vf5+OOPpUuXLpIiRQpvsGD79u3So0cPfzcbAACCBQAA3EtPP/206/aGDRssWBB+f3iXLl2SZMmSSVzSqlUrGTdunMyePVv69OkT4bh2dhMlSiTNmzf3S/viokmTJsnhw4dl3bp1UqFCBdcxDSAkSZLEb20DACA6TEMAAMDPtKbAQw89JFu2bJHKlStbkOC1116zY4sXL5Y6depI1qxZJTQ0VHLnzi1DhgyRGzduRLjOhAkT7Limumua+9q1ayN9vCtXrsiAAQMkT548dk2dOvDqq6/a/uhUrFjR5vlrUCCyaQrz58+XRx991NqqI+dt27aVXLlySdKkSSVz5sw2sq6j6rei0zIGDhwYYb8+tl7T19mzZ20kXp+DPhd9Tm+//bbcvHlTbteKFSukePHi1s5ChQrJ559/7j124MABa8+7774b4X4//vijHdPgSVT2798vwcHBUq5cuQjHUqVKZY/pvAe+/PJLy9pwpqbo83X8/fff0qFDB8mUKZPdp1ixYjJt2rQI19Tn/f7770uRIkXsvAwZMkjt2rVl8+bN0b4GQ4cOtUDPhx9+GO15AICEg8wCAADiAO1EP/744zYqr1kH2il0CgBqmvrLL79sP7/77jt54403bFR65MiRrhHs5557zkavtfOsndz69etLunTprCPt25nU/T/88IM8++yzNv3ht99+s87w3r17ZdGiRVG2UTuwLVu2lGHDhsmOHTukcOHC3mNff/21pdxr9oHS7AltQ7t27SxQoOdrMEN/anaFXuu/0uyLKlWqyP/+9z977jly5LAOfN++feXYsWO3Nf//999/l2bNmknnzp2lTZs2MmXKFJtuoc+nZs2aFuzQIMnMmTMjTK/QfSlTppQnn3wyyuvrdA0N7Oi0E71+VPr16yfnzp2zaRxOYMKZnvDvv/9aMGHfvn1WmPDBBx+Uzz77zAInGizReggODSjoe0bfSx07dpTr169b0Ehfc50OEZnXX3/d/qY6xaRTp063fM0AAAmEBwAAxJoXXnjBE/5/v1WqVLF948aNi3D+pUuXIux77rnnPMmSJfNcvnzZbl+9etWTMWNGT/HixT1XrlzxnjdhwgS7rl7fMWPGDE+iRIk8a9eudV1TH1vPXbduXbTt37Fjh53Xt29f1/7mzZt7kiZN6jl37lyU7Z49e7bdd82aNd59U6ZMsX0HDx707tPbAwYMiHD/Bx54wNOmTRvv7SFDhniSJ0/u2bt3r+u8Pn36eIKDgz2HDx+O9rno9fSxFixY4N2n7c+SJYunRIkS3n3jx4+383bt2uXdp695+vTpXe2JzPHjxz0ZMmSw+xcoUMDTuXNnz6xZszxnz56NcG6dOnWsTeG99957dv9PP/3U9fjly5f3pEiRwnP+/Hnb991339l53bp1i3CNmzdven/Xc/R9qF555RV7P0ydOjXa5wEASHiYhgAAQBygKfQ6Ch+eTilwXLhwQU6ePCmPPPKIjarv3r3b9muKuaap6+i47xx4HXlOnTq163o6Iq3ZBFpoT6/lbNWqVbPj33//fbTt1DT9EiVKyJw5c7z7/vnnH1myZIktQ6ip9eHbffnyZXsMJxX/559/lpigz0Vfi7Rp07qeS40aNWw0Xwsu3opOmWjYsKH3tra/devWsnXrVjl+/Ljta9q0qaX0ayaBY/ny5fZYt6o9oRkiv/zyi/1tzpw5YzUfNDtDV0TQ6ST/13eP3rJlyyw7o0WLFq6Ck926dbPVFFavXm37FixYYBkbOsUkvPCZHPq4mqWgUxY+/fTTaLMeAAAJE8ECAADigPvvvz/SYneatq+dWe30a0dW56A7HVRNW1c6z13lzZvXdV/tUGoaffi0e72mXsd3y5cvnx3XoMOt6FSDgwcPWsq/0qkLGrxwpiAonZKg6fHaWdbAgT6Gps/7tvu/0uei0wXCPxcNFtzuc9EaB+E70s5rcejQIfuZJk0aqVevnqtWgwYO9G/mBFmikyVLFlv5QKdG7NmzRz744ANrp04n0ekjt6J/X/3bak2ByFbQcP7+Wh9Bgx869eRWdFWOjz76yGoU+AYhAABwULMAAIA4wHck3qHz0XVOvgYJBg8ebMULdYRbR+Z79+59R0X8HHofLX43evToSI/71jeIinYutSCidp61RoL+1NH9J554wnuOjsZrMKFXr15WPFDn3+tja7G9u2m3Cl/UUa+jdQW0LZFxOv0xQbMNNJNBn5O+fppJ8fzzz0fowEdHgxLaJt20aKUGADTooLUFYpvWYdi2bZuMGTPG/la3E2AAACQsBAsAAIijVq1aZYUPtTq/rpLg0FH98EX0nJF235FuXaFAz9XK+Q4NOGhafPXq1e+6yKCOXuuqB9p57t+/vxUz1CkPTmaEptuvXLlSBg0aZKPnDm3f7dDAgwZKfF29etVG5n3pc9E0fCeT4G5o0UBNyfd9LbTQo/JdjUCDHJoNoJ37smXLWibFM888c9ePqxkf+jx9n1NUfw/9++rqEhoc8Q1OONNQnL+/vh46PUKzOm7V+deMihEjRljhRH1u+vfSYo0AADiYhgAAQBylS+4p33nt2mkeO3as6zytcq8dWZ0Pr8cdWhU/fKdbR5F19YCJEydGeDytuq/1B26HTjnQNH9dhUCDEr5TECJrt7qd1QmcTm/4egO6kkL4zAJ9LuvXr7cOcnj6vHUlgFv5888/ZeHChd7busqEpuhrNoTWCXCEhIRYRsW8efPsddXsgqJFi97y+j/99FOkr+nGjRstEJQ/f37vvuTJk0c6RUMzNrR+wty5c7379LnpFALN2NDsE/XUU0/Za65BmvAiq42g7dd6CLt27bJpFvr3BwDAQWYBAABxlKb46+izFp/TYnY68qxL8IXv+GltgqFDh1rHXTMLdClAzSjQZQDD1yzQ0XDt8GrBPS1mqOno2gnXUWrdrx3vqJbY86UdU03DX7x4sU1d8M180GkTeltHrjWQoHP7V6xYESEjIiqalq/t08fQaQaaCaHtSp8+ves8neLgFFbUzIZSpUpZx1yXgpw/f77VHAh/n/B0SoAuN7hp0yarrzB58mT566+/7LWLbCqC1hvQ1+3tt9++reeify/NRtC6E9o+zb7Qzrk+jk4pee2117zn6nENCOgymWXKlLFAgHbidYlLXdZQn+OWLVss40Gf37p16ywA42QEaLaH/n21jZrF4Uz50KUT9ZgWNAxPi07q31ADEo0bN7b6E/p+AgCApRMBAIgDSycWLlw40vN1KcNy5cp5wsLCPFmzZvW8+uqrnuXLl9s1vv/+e9e5Y8eO9Tz44IOe0NBQT+nSpW2JQr2279KJzrJ7b7/9tj2mnps2bVpPqVKlPIMGDfIufXg7mjRpYu3QNoV39OhRT8OGDT1p0qTxpE6d2s79888/IyyLGNnSiTdu3PD07t3blibUJSJr1arl2bdvX4SlE9WFCxdsGcc8efJ4kiRJYvepUKGC55133rHnGR29ni5XqK9n0aJF7bXQ5Q0/++yzKO+jr5kuNajP73b8+uuvnl69enlKlizpSZcunSckJMSWZtTX4+eff3ade/HiRU/Lli3tNdPXxHcZxb/++svTrl07e376PIsUKWKvXXjXr1/3jBw50p6HnqfLNj7++OOeLVu2RLp0omPx4sXWtmbNmtnrDwBAkP7H3wELAACAQKDLRmo9AJ3jDwBAfEbNAgAAgNuwefNmW0FApyMAABDfkVkAAAAQje3bt1utgFGjRsnJkyflwIEDVm8AAID4jMwCAACAaGgxwXbt2lmxxtmzZxMoAAAkCGQWAAAAAAAAFzILAAAAAACAC8ECAAAAAADgEuK+idh08+ZN+fPPPyVlypQSFBTk7+YAAAAAAOI5j8cjFy5ckKxZs0qiRFHnDxAs8CMNFGTPnt3fzQAAAAAAJDBHjhyRbNmyRXmcYIEfaUaB80dKlSqVv5sDAAAAAIjnzp8/b4PWTn80KgQL/MiZeqCBAoIFAAAAAIDYcqup8AQL4oDKr8+W4NAwfzcDAAAAAHCHtoxsLfERqyEAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIVgAQAAAAAAcCFYAAAAAAAA4l6wYP369RIcHCx16tTxd1MAAAAAALhja9euleLFi0tYWJj9vHHjhrz44ouSLl06KVKkiGzZssXOO3HihNSuXVtSpUoljz/+uJw8edL2V65c2falTZtWevTo4b1uzpw5JSgoyLs55/vatGmTPYY+Vrdu3eyx1aRJkyRbtmy2TZkyJfCCBfoE9EVcs2aN/Pnnn/5uDgAAAAAAt+3s2bNSr149KVy4sGzevFk6duwos2bNko8//lgWLlwohQoVkqefflo8Ho/06dNHDhw4YMGF/fv3S79+/ewaJUuWtH0aKHj//fdl1apV3uuPHj1ajhw5YpsGBHzpNVu2bGmPoY81duxYmTdvnhw6dEiee+45efnll2179tln7f4BEyy4ePGizJ07V7p06WKZBVOnTvUe0xdHIyfLly+XEiVKWISmWrVq8vfff8tXX30lBQsWtMiLvjCXLl3y3u/rr7+WSpUqSZo0aeS+++6TunXr2h/BMXDgQFdkxtmcx75y5YpFYzJmzChJkya1a2mkJny7Vq5cKaVLl5ZkyZJJhQoVZM+ePbH2ugEAAAAA4oYvv/xSzp07J2+99ZYFDLp27Wr92Hz58kmVKlWkUaNGsnv3bgsS6P4aNWpIsWLFpHr16rJs2TK7xnvvvWf7HnvsMbt9+vRp7/UHDRok5cuXl48++kgSJXJ347Wvu2/fPnnqqafssfLmzWvX/Pbbby3DQIMUrVq1kuvXr8uKFSsCJ1igEY8CBQpI/vz57UlMnjzZIiO+tHM/ZswY+fHHHy0S0rRpU3shNVKjfxR9wh9++KH3/H/++cciJxrR0Q69vpgNGzaUmzdv2vGePXvKsWPHvNs777xjHX7t+KtXX31VFixYINOmTZOff/5Z8uTJI7Vq1XL9sZRGgEaNGmWPExISIu3bt4/2uWoQ4vz5864NAAAAABDYjhw5YgPK2lfNkiWLdO/e3aYbpEiRwo47P3Vf+P1623Ht2jV544035IEHHvAGDQYPHiyrV6+WDh06WDDCCS44nPuHv6bvft/Hv10hEgemIGiQQOm8DY3G6AtRtWpV7zlDhw6VihUr2u/6AvXt29eiJ7ly5bJ9jRs3lu+//1569+5ttzWi4ksDEBkyZJCdO3fKQw895HqxNmzYIK+//roFBvSYBho0VUSzDHT+iJo4caJ888031tZevXp5r/vmm29a5EZpKolmRly+fNmyESIzfPhwiwgBAAAAAOKPdOnS2aB38+bNrU+o/cPMmTNbtru6cOGC/dR+qW7Obf2pt5WTBaC1DbRP7PRZW7dubT9z5Mhh/ckdO3bIE0884X1s5/6+19QBed/9zoC8sy/OZxZo2v7GjRulRYsWdltH55s1a2adcl9Fixb1/p4pUybLAnACBc4+nZrg+P333+2aeo5OU9CCEOrw4cOu6+rtBg0aWKaBRoCUBiE0muMEJ1TixInl4Ycfll27dkXZLo0eKd92hKdBDg2GONudzBcBAAAAAMRN1atXt4z2JEmSSGhoqO3TLADtm+o09s8//9ymJGgftWbNmjZFYNu2bZYJr4PmSuscLFq0SD755BMrcqiZ6H/99ZdlGmiAYMKECXaeTnNQR48etXP0mrlz57bseH0snZKg13TaNGPGDJk5c6YtKqDTHwIis0CDAjpvImvWrN59GvHQF1enHfh21h2a2uF729nnTDFQWlhC0zY0I0Cvrcc0a+Dq1aveczSDoH79+jbvQ9M67kb4dinfdoSnz8t54wAAAAAA4ofcuXNbYUHtW2pmgWaka50AHRzXKfH333+/ddq136hBhGeeecZWP9D+6LBhw+waTg09J1N+wIABVuxQs9x16rxmGuhUeCerIHv27JZdr9fTYIBm4etjde7c2TIcNDgwbtw4m9avxo8fb/3k250O77dggQYJpk+fbnP+nbkYDh3tnz17tqVO3KlTp05ZxoIGCh555BHb98MPP7jO0YCEpndox975g/n+kTUatG7dOnshlWYaaIFD3+UrAAAAAABw6MoDuvnSgoS6+dLM+MgKDYav3edYv359pPt9zy9btqxs3749wjmdOnWy7W74LViwdOlSOXPmjEU/UqdO7TqmkRTNOhg5cuQdX1fTNXQFBE3R0KkBOtVA54v40siKpn3oH0hXY9BNaTuSJ09uKzNoJEjnnei8kBEjRthqC9pWAAAAAADiO7/VLNBggM6XCB8ocIIFusLAr7/+esfX1TkZc+bMsaIQOvXgpZdeihB00GIRGiDQ5Q41oOBsuoSj0jQObYOmhuhalzrnQ5e30EAEAAAAAADxXZAnqlwH3HM6V0SDJcVeHCfBoWH+bg4AAAAA4A5tGfl/qxUEWj9Ui+7rggBxcjUEAAAAAAAQ9xAsAAAAAAAALgQLAAAAAACAC8ECAAAAAADgQrAAAAAAAAC4ECwAAAAAAAAuIe6b8Ic1Q1tEu2QFAAAAAACxicwCAAAAAADgQrAAAAAAAAC4ECwAAAAAAAAuBAsAAAAAAIALwQIAAAAAAODCaghxQOXXZ0twaJi/mwEAAADgHtoysrW/mwDcNjILAAAAAACAC8ECAAAAAADgQrAAAAAAAAC4ECwAAAAAAAAuBAsAAAAAAIALwQIAAAAAAOBCsAAAAAAAALgQLLgNAwcOlOLFi/u7GQAAAAAAxIp4ESxYv369BAcHS506dfzdFAAAAACI1KFDhyQoKMi7PfTQQ/Lnn3/awGSiRImkXLly3nN1f/Xq1SVVqlRSq1Yt+euvv2z/Dz/8IAULFpR06dJJ165d5fr167b/448/lsyZM0u2bNnkk08+ibINu3fvlpCQEDtXeTweef755yVNmjS26TWBeBMsmDRpkrz44ouyZs0a+0cFAAAAAHF5sPPIkSOycuVKG/Rs166dBQ589e3bVw4cOCBr166V/fv3S58+fWz/008/bcGChQsXWoBg5syZsm/fPusPvfTSS7Z17tzZ7huZAQMGWLDAsW3bNrvOCy+8IK+88op89NFHsnnz5nv8CiAQBHyw4OLFizJ37lzp0qWLZRZMnTrVe2zVqlUWsfvyyy+laNGikjRpUovWbd++3XuOnq8RtEWLFknevHntHI3c6T/e6Gi0Tv+R6vkFChSQsWPH3tPnCQAAACB+0H5LjRo1ZPXq1ZIpUybp3r27ZQr40g57qVKlpFixYlK2bFlZsWKFnDhxQv744w+pVq2aVKlSxbIDdP/WrVvlxo0bdt369evb7xqICO/XX3+1zAQ9x3H//fdLypQp7aduKnny5LHwKiCuC/hgwbx586yznj9/fouyTZ482VJpfPXq1UtGjRolmzZtkgwZMki9evXk2rVr3uOXLl2SN998U6ZPny7r1q2Ts2fPSvPmzaN8TI3evfHGG3afXbt2ybBhw6R///4ybdq0aNt65coVOX/+vGsDAAAAkDDolALtS3z//feSL18+adOmjZw6dSrSczUQsHfvXrl8+bJNHTh9+rQNcupg5c6dO21awsmTJ22/M6VA9zsDo7o/PO3DaMZCsmTJvPvSp08vDRo0sOkHHTt2tKwEHRQFEsWHKQgaJFC1a9eWc+fOWYQufKpNzZo1pUiRItah139Ymrbj0MDBmDFjpHz58ha903N+/PFH2bhxY6SPqdfT4EOjRo3kwQcftJ+a7jN+/Pho2zp8+HBJnTq1d8uePXuMvAYAAAAA4j7NHmjZsqVlPevUAw0ERDVdYPDgwXL06FEb5T948KDVIkicOLGMGDFCJkyYIDly5JDQ0FDb/8gjj0jTpk1twFM7/Er3h88q+Pnnn6V9+/bewVXNQFi+fLnMmDHDBkBHjx4t48aNs6kPQEAHC/bs2WMd+hYtWthtnXvTrFkzCyD40iCA7z9QzULQjACH3q9MmTLe25qpoFE733Mc//zzj80Z6tChg6RIkcK7DR061PZHR6N4GsxwtltNdQAAAAAQf+iUAc2E1kyBWbNmWZaAdvr1tmY7O1kEOpiZJUsWGwRdunSpneP0eSpXrmxTFJysZme/TmXQWgg9e/a0gcknnnjCggEacNA+jAYltP+hwQfNqNYBVJ3KoNO2lbZFgw/q+PHjfnuNEHf8/5UtApAGBbT6Z9asWb37NEqmb3LNFLhXNRLUxIkTbe6QLy1OEh1tl/MPEAAAAEDCooOMmhmgqyLoyL+O6P/777+utH/9XTMJdHS/W7dulk3QuHFjee211+y4FiPUums69UCzAbR+gerUqZMNXurA6OLFiyVt2rT2OJoJrffRrAOdlq0GDRpkgQXtT+XJk8eyHHS5+Js3b9p5vjUNkHAFbLBAgwQaEdPpAI899pjrmM65mT17tmUIqA0bNlg0Tp05c8bm/vj+g9RraXTu4Ycf9mYsaN2CyObqaAESDU5oZK5Vq1b3+FkCAAAAiC8qVKhgmQPhha+5pnLmzGk1DcLTaQK6hbdjx45Ir+F77dKlS9vPL774wnWeZjvoBsSLYIGm42jHX6cDaJqNr6eeesqiZCNHjvTO97nvvvuso9+vXz9vEQ+HRut0qZEPPvjApiRocQ9dNcEJHoSnkTiN8unjap0ELVyowQZtz8svv3yPnzkAAAAAAPdWwNYs0GCALjcSPlDgBAu0865FPNRbb71lc3i0eKHOv9FIWpIkSbznazXQ3r17W7GRihUrWnqQLscYFS0aoksnTpkyxYom6lwfTQXSFB8AAAAAAAJdkCeynJd4YtWqVfLoo4/aiL8WLIyMdvJ79Ohh0w5imy6dqMGOYi+Ok+DQsFh/fAAAAACxZ8vI1v5uAuDth2rRfV3OM95lFgAAAAAAgHuDYAEAAAAAAEg4wYKqVata9c+opiCotm3b+mUKAgAAAAAAcVW8DhYAAAAAAIA7R7AAAAAAAAC4ECwAAAAAAAAuIe6b8Ic1Q1tEu2QFAAAAAACxicwCAAAAAADgQrAAAAAAAAC4ECwAAAAAAAAuBAsAAAAAAIALwQIAAAAAAODCaghxQOXXZ0twaJgkdFtGtvZ3EwAAAAAAZBYAAAAAAIDwCBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIVgQQxZtWqVBAUFydmzZ/3dFAAAAAAA/pMEESxo27atdeTDb/v27fN30xCJCRMm2N+nefPm3iCMs9WtW9d1bsuWLW3/uHHj7PaGDRvkoYcekqRJk0qRIkVk06ZNEa7fq1cvyZgxoyRPnlwef/xxOX36dKTvk/nz58fSMwYAAACAuCVBBAtU7dq15dixY67twQcfvOPrXL169Z60D//nypUr8uabb0qSJElc+48cOWLbtGnTvPt27NghixYtcp03fPhw+9tu3LhRTp48KYMGDYrwGGnTppXPP//cggErVqyQDz74wHusSZMm3seqU6fOPXmOAAAAABDXJZhgQWhoqGTOnNm1BQcHy+rVq+Xhhx+241myZJE+ffrI9evXvferWrWqdO3aVXr06CHp06eXWrVq2f5ly5ZJvnz5JCwsTB599FE5dOiQH59d/MoqKF68uP0tfJUsWdKyCn799VfvvjfeeEM6derkOq9AgQKWVeD8bTR7ILzXXntNKlWqJI899pj93Z3MAufvqo+lf+/Lly/fk+cIAAAAAHFdggkWROZ///ufPPHEE1KmTBn55Zdf5OOPP5ZJkybJ0KFDXefpaLaOdK9bt87S3XXUuVGjRlKvXj3Ztm2bdOzY0YIMtzNqfv78edeG/9+///4rb731lgwZMsS7L3v27LJw4UJZvny5dexbtGghHo9Htm7datkDXbp0cV2jcePGcunSJQsSaP2IgQMHRvl4+jgaGNLpB859V65cKePHj5clS5ZYlgIAAAAAJEQhkkAsXbpUUqRI4b2tc9V19Fk7o2PGjLE56joq/eeff0rv3r1t1DpRov+LpeTNm1dGjBjhGpnOnTu3jBo1ym7nz59ffvvtN3n77bejbYN2PiNLi8f/mThxolSsWFEKFSpktzUooFNF9LVWWsPg5ZdftukF2tHXAE3ixInt2M2bN+18zQLJkCGD/b2fe+45efHFF+Xbb7+N8FgffvihDB482AJBmkmgfOshFCxY0KY5AAAAAEBClGAyC3SqgGYBOJvOU9+1a5eUL1/eAgUO7axevHhRjh496t1XqlQp17X0fmXLlnXt0+vcSt++feXcuXPeTTMU8P87cOCAfPbZZxYA+OOPP2TevHmSJ08eqy2gr7nWGciUKZNNB9FzNTCgx9ULL7xgWQH6twwJCZFkyZLZT61foE6cOGGbmjp1qnTv3t2CPvq+cPbrbc1W0CyGPXv2SOHChf34agAAAACA/ySYzAJNS3c6lndz35igafS6IXKvvPKKPP300/Z7/fr1bTWD1q1b2+oF2unXDI+5c+daQGDWrFk23UD367kaiNEAjmZ36NQEDd7kyJFD3n//fW/hQq1BoKslaLBAsxC0kKJuVapUsVUXjh8/bjUpdGqCZhn069fPz68IAAAAAPhHggkWREZTzRcsWGAdRye7QOsSpEyZUrJlyxbt/XROuy/thOK/0SkhuimdDuJo1apVhHOdqQpK/34O7fjv3LkzwvkaDIjsd1+TJ0+2DQAAAAASugQzDSEyzz//vE0F0Hntu3fvlsWLF8uAAQNsXrxTryAynTt3lt9//91GvDVdXUe5dbQaAAAAAID4IEEHC+6//35bKk/nqRcrVsyCAB06dJDXX3892vtpertmJCxatMjupyskDBs2LNbaDQAAAADAvRTk8c3hRqzSpRNTp04txV4cJ8GhYZLQbRnZ2t9NAAAAAIAE0Q/VovupUqWK8rwEnVkAAAAAAAAiIlgAAAAAAABcCBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFxC3DfhD2uGtoh2yQoAAAAAAGITmQUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIXVEOKAyq/PluDQMIlvtoxs7e8mAAAAAADuApkFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABeCBf/P8ePHpXv37pInTx5JmjSpZMqUSSpWrCgff/yxXLp0yc7JmTOnBAUFyZw5cyLcv3DhwnZs6tSpfmh93LRz5057zUJDQyVXrlyyYMECqVq1qr1Ozqb7VcuWLSVdunSSKlUq+/3q1aty6NAh17m6DR48OMLjhL/m5s2bbf+yZcskd+7ckjFjRhk2bFisP38AAAAACFQEC0TkwIEDUqJECVmxYoV1Krdu3Srr16+XV199VZYuXSrffvut99zs2bPLlClTXPffsGGDBRuSJ0/uh9bHXdrx/+STT2Tbtm2SIkUK6devn3z22Wdy5MgR2b9/v6RMmdI6+kqDCvr6jx49WmbPni2zZs2y11rP1e2jjz6y85zzw3vppZe85xYrVkwuXrxoQYcnn3xSxowZY4+tf1MAAAAAwK2F3MY58d7zzz8vISEhNiLt2+HXUW/tbHo8Hu++Vq1aybvvvmudUu3MqsmTJ9v+6dOn+6X9cVW2bNlsu3btmgUOMmTIYJvSoMGFCxekQ4cOdtsZ+b///vvt5+nTpyU4ONjur7788kvJmzevVK5cOdLH0qCEBhnq1KkjY8eOtQDOuXPnpHnz5lKmTBlp27atZRqUL18+lp49AAAAAASuBJ9ZcOrUKRvRfuGFF6LMDNDUdodOT6hVq5ZMmzbNbusUhblz50r79u1v+VhXrlyR8+fPu7b4Tjvu+rpu3LhRGjdu7N0/adIkKVCggE318NW3b19JnTq1NG3a1Lvvf//7nyxfvtwbWIgs2LNq1SoZNGiQXVcDBydOnLBjmtGgfz9tg7MPAAAAABC9BB8s2Ldvn2UO5M+f37U/ffr01tHUrXfv3q5jGhjQ2gR6v/nz59u8+OLFi9/ysYYPH24dYWdzMhPiM8240IyNChUqSJcuXew106yMb775JkLnv2fPnlYPQmsbOBkFSgMz2uFv06ZNpI+hgYWSJUvKs88+axkMO3bs8GYwaPaCPqZOS3D2AQAAAACil+CDBVHRkXCda6+FCzUjwJemumvnc82aNTYF4XayCpxRc02NdzbtNMdn69atk127dlnByCRJkthPpwikTjFo3bq191zNCtB6BTrFQwM3Z86c8R7TGhH6mmfOnNm77+jRo97MDC1M+csvv8inn35q+/RvVrZsWQscaPBh3rx5cvnyZaldu3YsvwIAAAAAEJgSfLBAVz/QDuyePXtc+7VegR4LCwuLcB+tb/DMM8/IgAED5KeffrLR89uhqwJoB9Z3i++FI+vXry9FixaVP//80zIEdJRfgwX16tWzVQp8AwJ6TKcUaMaFFixUq1evtuyP8FkIeo5T50ADEpUqVZIXX3xROnbsKJ06dbLiiRo8WLx4sXTt2tVWUQg/5QEAAAAAELkEX+Dwvvvuk5o1a1rFfO1s3u6KBppN8M4770izZs0kbdq097ydgUgDKrqFpyshhKfLJEamSpUqrgKTDt99WnMiMhqQ0A0AAAAAcGcSfLDAKcKno86lS5eWgQMH2kh4okSJZNOmTbJ7924pVapUhPsULFhQTp48KcmSJfNLmwEAAAAAuFcIFohYgcKtW7daWrvWFdD58DploFChQlZ0T1Pjo8pKAAAAAAAgvgnyRJbjjVihxfh0VYRiL46T4NCItREC3ZaR/38BQwAAAABA3OmHatH96OroJfgChwAAAAAAwI1gAQAAAAAAcCFYAAAAAAAAXAgWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwCXHfhD+sGdoi2iUrAAAAAACITWQWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAAAXVkOIAyq/PluCQ8P83QwAABDHbRnZ2t9NAAAkEGQWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWHCbDh06JEFBQbJt2zZ/NwUAAAAAgIQdLDh+/Lh0795d8uTJI0mTJpVMmTJJxYoV5eOPP5ZLly75u3kAAACxZufOnZIzZ04JDQ2VXLlyyYIFC2Tq1Kk2oOFsXbt2tXNv3rwpAwYMkKxZs0qqVKnkrbfesv1t27Z1nT9//nzb/+STT0ry5MklTZo00qlTJ7lx40aEx3/zzTclXbp0dr+vv/7a9p08eVIefvhhu2/GjBllxIgRsfqaAAASYLDgwIEDUqJECVmxYoUMGzZMtm7dKuvXr5dXX31Vli5dKt9++62/mwgAABBrtNP/ySefWKZjihQppF+/frY/W7ZscuTIEduGDh1q+6ZNm2a/v/POO7Jq1SrJly+f9zpNmjTxnl+nTh3b16FDB/uu1aVLF3uMTZs2RXj8vHnzyosvvujad/XqVbvGxo0bpUGDBtK7d2/LyAQABLY4HSx4/vnnJSQkRDZv3ixNmzaVggULWhRdI99ffvml1KtXz847fPiw7dP/aer/RPXcv/76y3UtzUTInTu3JEmSRPLnzy8zZsxwHd+9e7dUqlTJshcKFSpkgQiNmi9atCjK9m3fvl0ef/xxe1zNeHjmmWcsug4AAHAvaFCgRo0alnGp33n0u5GTiakDLPodSL8XqVmzZknVqlWlZcuWUrJkSWnUqJH3OsuWLbN9PXr0kMuXL9u++vXrW0Ahe/bs9t1Gf4an13/00Udd+zRzQTMYChcu7D12+vTpe/o6AAAScLDg1KlTllHwwgsvWFpbZLQzryl2GijQ/ymtXr1avvnmG8tIaNasmfe8hQsX2lSGV155xTr4zz33nLRr106+//57O65pdhoJT5Ysmfz0008yYcIEb6Q+KmfPnpVq1arZ/5g1mKGpeBqg0P+JRuXKlSty/vx51wYAAHAnxo4da9+NdCS/cePGUqRIEcu4/OKLL+y7SMeOHe08zRr4448/JEeOHBZUcKYN6H1Wrlwp48ePlyVLlsjw4cNt/7lz5+y7kH73ql69umTIkOGO2nXhwgW7VpkyZaR48eL34JkDAGJTiMRR+/btE4/HY1kAvtKnT++NgOv/zDS6/ttvv8nBgwe9EfDp06dbdFvT5/R/WJp+p/PzNFNBvfzyy7JhwwbbrxFwDTDs37/fUvQyZ87snZNXs2bNKNs3ZswYCxTo9AjH5MmTrQ179+51pfo59H+ggwYNiqFXCAAAJEStWrWybMhu3brZlAHt5OsAiqpbt65NIVBaW0C/33z++efSp08fGyg5duyYnePQIMKOHTvs95QpU9r0hsWLF9uUTw0+PPXUU7fVJq0jpVMRdCDkq6++kkSJ4ux4FADgNgXcJ7lG0fV/ZBoM0JH6Xbt2WQfdN1VOpxFocR49pvSnFkX0pbed43v27LH7O4ECpYV6ovPLL79YZoKm6TlbgQIF7Jj+jzkyffv2tf+hO5tG/AEAAG7XunXr7PuLTpvUqZX6UzMNtIOu302WL19u35GUDnpopz0sLMymder56rXXXrPvU3qufgfS8/V7iQYVgoOD7Xzl/Dx69Kg3G1KDDc40B92vt69duyYNGzaUX3/91eok6GAPRagBIPDF2cwCnYunUXL9n5gvrVng+z8wf7l48aLVTHj77bcjHMuSJUuk99HKxboBAADcDZ1qqdMqtfOu35W0c67ZlVqc8MyZM1KsWDGZOHGinduzZ08LLFSpUsVqHWgGpFPfoFatWnL9+nXLMtCpl/p7//797fo64KJZmFqXSemAihYt1NUUdOBDH1Ppiglt2rSRgQMH2tRRpTUS1JQpUyyrEwAQuOJssOC+++6ziLim+2vV3ajqFmj6nFPN18ku0GWFtKaAZhg452gkXv+H5tDbznGd6qD313l+WqhQRVYB2JcWBdLlinT5Io3WAwAA3GtaTFm38Jyplr50WsG8efMi7NeggRM48OVkXIanmQIOXaZRt+jOAQDED3F6GoKm1Wmku3Tp0jJ37lz7n5hmGnz66ae2eoGmymnNAi3so/P3fv75Z0ura926tUXR9X6qV69e9j82XRHh999/l9GjR1uqnUbclQYldKUEDSZoCp0GEl5//XU75swBDE/rJWhRxRYtWlhgQaceaDqfzgeMbF1iAAAAAAACRZwOFmgHXtf71YCApr1pap0GAD788EPr6A8ZMsQ681qIJ23atFK5cmU7V6cqaHDBoSsdvP/++1bQUOflafVfTY9zUuU06KBLJOrUAi2IqFWEndUQdC5gZHSZIA0qaGDgscces4CFLj+kqXsU9QEAAAAABLIgD3ljkdJAgFYa1lUZNGhxL+h8w9SpU0uxF8dJcKh/azAAAIC4b8vI1v5uAgAgwDn9UC1umypVqijPY7L9/7Nw4UJb0SBv3rwWIOjevbutmHCvAgUAAAAAAMRVBAv+nwsXLlilX10OKH369DadYdSoUf5uFgAAAAAAsY5gwf+jRRF1AwAAAAAgoaMSHwAAAAAAcCFYAAAAAAAAXAgWAAAAAAAAF2oWxAFrhraIdskKAAAAAABiE5kFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAAAXggUAAAAAAMCF1RDigMqvz5bg0LC7uu+Wka1jvD0AAAAAgISNzAIAAAAAAOBCsAAAAAAAALgQLAAAAAAAAC4ECwAAAAAAgAvBAgAAAAAA4EKwAAAAAAAAuBAsAAAAAAAALgQLbsOhQ4ckKChItm3b5u+mAAAAAABwzwVMsKBt27bSoEGDCPtXrVplHfmzZ89KQnXt2jUpV66cJE6cWDJnzmz7/vzzTylevLgkSpTIjoXXsmVLe93GjRtnt3ft2iVlypSR1KlTS/PmzeWff/6JcJ+cOXPafZytWrVqtr9q1aqu/Zs3b77nzxkAAAAAcO8ETLAAUdMOesOGDaVKlSrefcHBwdKuXTt56KGHIpy/Y8cOWbRokWtf586d7T7ff/+9LF++XN55550I99uwYYMcOXLEggEahNAggeOll16yY7oVK1Ysxp8jAAAAACD2xLtgwYIFC6Rw4cISGhpqI+GjRo1yHdd9w4YNk/bt20vKlCklR44cMmHCBNc5GzdulBIlSkjSpEmldOnSsnXrVtfxGzduSIcOHeTBBx+UsLAwyZ8/v7z//vviLyEhIdK7d2/Jli2bd1+mTJmke/fuki5dugjnv/HGG9KpUyfXPg0AVKpUSUqWLCmFChWSFStWRLifZi3oY3z33Xd2W4MRjk8++cQyEwYOHCgejyeGnyEAAAAAIDbFq2DBli1bpGnTppZG/9tvv1nHtX///jJ16lTXeRpAcIIAzz//vHTp0kX27Nljxy5evCh169a1DrNeT6/Rs2dP1/1v3rxpnebPPvtMdu7caZ3v1157TebNmxdt+65cuSLnz593bbFNn7MGQ/Q5hw8E6FQEnX5w8OBBOX36dJTXmDx5sjz22GOSPXt2u62voU4HGTRokEyaNMkCBwAAAACABBYs2L59e5THwqe3x6SlS5dKihQpXNvjjz/uPT569GipXr26BQjy5ctndQ66du0qI0eOdF3niSeesA5unjx5bEQ+ffr0ln6vZs2aZcEA7fRqhoIGDnr16uW6v9YG0I6xBhw0u6BVq1Y2yn6rYMHw4cOtJoCzOZ3t2DRkyBDp06ePPQelz1UzAUaMGGEZA9quf//915Wl4OvHH3+U3bt3W2aFQwM0mpHw7LPPSqpUqWyaAwAAAAAggQULatWqZaPPkU0B0I7zvfLoo4/aigS+m+8oto6MV6xY0XUfvf3777/b1AFH0aJFXfP9dVT977//9l5Dj+sUBEf58uUjtOWjjz6SUqVKSYYMGSxooVMZDh8+HG37+/btK+fOnfNuOr8/pmgHXq+pz9P5XX9eunRJLl++bL9rIcQDBw5YAEUDJeqFF16QlStXWiaFZhzo31CfT4sWLez4iRMnbHNoEEWf85NPPundp9MdfvnlF/n0008tW0KDLAAAAACAwBVyN3fq2LGj1KhRQ9atW+etvj937lyrAxA+5T8mJU+e3NvJdRw9evSOr+OMqvsGDHSE/XbNmTPHpibodAYNJGjtA81e+Omnn6K9n9ZR0O1eKFiwoOv3KVOmuGoK6D4N8GjmhAYQjh07JvXr17cARtmyZeWDDz6wWg6aGaB/X83KUE2aNLFggxY31CkKmj2hGQS+r6EGWLTegdZO0PuGr4cAAAAAAEgAwQJNwdc57RowWLNmjXz99dfWSZwxY4Y89dRT4i/aIdYAhi+9rVMStNL/7V5Dn4d2kJ3sAu0oh79mhQoVbCqDY//+/eJPkRUVdDr8t3Offv362Rae1iLwDdZcuHAhwjmRFUMEAAAAACTAAocffvihLZFXrlw5G0mePXu2XwMF6pVXXrGUep2Xv3fvXpk2bZqMGTMmQoHC6LRs2dIyDfQ5afHCZcuWRVhGMG/evLZ6gC4xqI+jNRI2bdp0D54RAAAAAABxOLNgyZIlEfY1atRI1q5da/PbtYPtnKPp7f6gRfY0TV5XJ9CAQZYsWWTw4MG3HGH3pfP1v/jiC+ncubMtn6hz+d9++21XIOS5556zVQWaNWtmz1ufv2YZfPXVV/fomQEAAAAAEHuCPJHlr0ciUaLbS0LQzrNvMUFETYsB6uoDxV4cJ8GhYXd1jS0jW8d4uwAAAAAA8bsfqkXxtWbdf84suJMCgAAAAAAAIAHWLAAAAAAAAPHTXQULunXrZkvthafFBHv06BET7QIAAAAAAIEULFiwYIFUrFgxwn5dTnD+/Pkx0S4AAAAAABBIwYJTp05ZQYTwtDjCyZMnY6JdAAAAAAAgkIIFefLkka+//jrCfl06MFeuXDHRLgAAAAAA4Ce3vRqCr5dfflm6du0qJ06ckGrVqtm+lStXyqhRo+S9996L6TbGe2uGtoh2yQoAAAAAAOJ8sKB9+/Zy5coVefPNN2XIkCG2L2fOnPLxxx9L69atY7qNAAAAAAAgFgV5PB7Pf7mAZheEhYVJihQpYq5VCcT58+et9sO5c+fILAAAAAAAxJl+6F1lFvgGCvbs2WO/FyhQQNKnT/9fLgcAAAAAAAK1wOE///xjUxGyZMkilStXtk1/79Chg1y6dCnmWwkAAAAAAOJ2sEALHK5evVq++OILOXv2rG2LFy+2fa+88krMtxIAAAAAAMTtmgU63WD+/PlStWpV1/7vv/9emjZtatMTcPtzRYq9OE6CQ8MkPtkykkKXAAAAABCoNQvuKrNApxpkypQpwv6MGTMyDQEAAAAAgAB3V8GC8uXLy4ABA+Ty5cveff/++68MGjTIjgEAAAAAgMB1V6shvPfee1K7dm3Jli2bFCtWzPb98ssvkjRpUlm+fHlMtxEAAAAAAMT1YEGRIkXk999/l5kzZ8ru3bttX4sWLaRVq1YSFha/5t4DAAAAAJDQ3FWwYM2aNVKhQgXp1KmTa//169ftmC6lCAAAAAAAElDNgkcffVROnz4dYb9WU9RjAAAAAAAggQULdLXFoKCgCPtPnTolyZMnj4l2AQAAAACAQJiG0KhRI/upgYK2bdtKaGio99iNGzfk119/tekJCZW+LgsXLpQGDRr4uykAAAAAAMROZkHq1Klt08yClClTem/rljlzZnn22Wfl008/lbhGAxt30oHXTv+iRYvuaZviu507d0rOnDktoJQrVy5ZsGCB7R87dqzt1wyUrl272j69ra+5s1WrVs32a+BFj2XMmFEGDx4c6eNofYxUqVJJ2rRppUePHt79y5Ytk9y5c9t9hw0bFivPGQAAAAASZGbBlClT7GeGDBlk4MCBkixZMrt96NAh61wXLFhQ0qdPf29aioCiHfhPPvlE7r//fmnWrJn069dP0qVLJy+88IKMGjVKatasacttqg0bNlhxzL/++ksefvhhqVq1qpw/f17atGljW6VKlaR58+ZSpUoV23yVLFlSPvzwQ3v/6XtSg0KlS5eWli1bSvv27aVcuXL2+FpLo3z58n56NQAAAAAgAdQs2Lp1q0yfPt1+P3v2rHXItAOoHbWPP/5Y4jLtiHbr1k1effVV67xqRoR2Mh06kq0aNmxoo9zObbV48WLrnCZNmtRGywcNGmSdXESULVs2qVGjhuTJk8cCBxpImjVrlr1uL7/8si2/+fTTT9u5+jfQ87/77ju73a5dO9mzZ49cuHBBatWq5Z3+smLFigiP895770mxYsXkscces9taeFODD1psUwMMTZo0seU8NdMAAAAAAHCPgwWPPPKI/T5//nzJlCmT/PHHHxZA+OCDDySumzZtmqXB//TTTzJixAhLcf/mm2/s2KZNm7xZFMeOHfPeXrt2rbRu3Vq6d+9uKfbjx4+XqVOnyptvvnnbj3vlyhUbMffd4jOdcqCv88aNG6Vx48Zy5MgRuXz5suTNm1cefPBB+zv4mjx5snX6s2fPbu8ppa/19u3b7ffIVuBQ165dkzfeeEMeeOABu/+JEydsf4oUKSzgo21w9gEAAAAA7lGw4NKlS1azwBnt1ZHfRIkSWYaBBg3iuqJFi8qAAQOs06oBAE1bX7lypXeKhUqTJo2NeDu3NYugT58+lhavo+OaRj9kyBALGtyu4cOHu+o8aKc4PmvVqpVs3rzZil526dLF6gpop33ChAn2mnfs2FH++ecfO/fHH3+U3bt3S4cOHex2jhw5pFevXtK7d2+rS6C1DzT7IDwtrKkZClu2bJEvvvjCAgTO30wzE7S+xsWLF737AAAAAAD3KFigqeU6R1xHipcvX+5NAf/7778t5TwQggW+smTJYm2Pjs6v1wwE7Yw6W6dOnSz7QIMnt6Nv376WHu9s+vrFV+vWrZNdu3bZlI0kSZLYT32f6Ei//p44cWIJDg62TU2aNMk69E8++aT3GjqFQIMNo0ePtk5/06ZNbf/Ro0e9WRkacND3otZH0GCE7i9btqy9D+fMmSPz5s2zbIbatWv76ZUAAAAAgHhe4NChKd9aQO6ll16S6tWrewvHaZZBiRIlJK7Tjqov7cDevHkz2vvo6LRmFzjz531p5/d26Oi473KT8dmBAwfklVdesc67Bpd0yoFmY+iUhMcff9wyN3Sqh752ml2gnXpdTcP3b6PZH5rxodMLZs6caZkgSjMyNOPgrbfesqkg6qmnnvLeR2tQ6KocOmVEf2qQp2LFin56JQAAAAAggQQLdP65VqjXUXUtLufQwIEWBgx02mHV9HZfWthQi+5pxxe39swzz9gWnhbADF8EU2sK6JSB8KIqSqhZBpH97qtevXq2AQAAAABiKVigdD6/br502bv4QFdA0BFtHY3WTABNb9dsirp169pceg2WaI0GnZqgxfeGDh3q7yYDAAAAAODfmgXxnS4DqasjaLq7M61Cl/BbunSpTbUoU6aMFXN89913LUUeAAAAAID4JMgTVR437jmdz6+rIhR7cZwEh4ZJfLJlZGt/NwEAAAAAEEU/VIvuR7dAAZkFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAJcd+EP6wZ2iLaJSsAAAAAAIhNZBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABdWQ4gDKr8+W4JDw/zdDCBO2jKytb+bAAAAACQ4ZBYAAAAAAAAXggUAAAAAAMCFYAEAAAAAAHAhWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIVgAQAAAAAAcCFYAAAAAAAA4n+woG3bthIUFCSdO3eOcOyFF16wY3rO7Vi1apWdf/bs2XvQUgC349q1a1KuXDlJnDixZM6c2fatXLlS7r//fgkNDZXChQvLmjVrbP/NmzdlwIABkjVrVkmVKpW89dZbrs8FZ5s/f77t37RpkxQpUkTSpUsn3bp1kxs3bkR4/KjOmTRpkmTLls22KVOmxOIrAgAAANxb8TJYoLJnzy5z5syRf//917vv8uXLMmvWLMmRI4df2wbgzmjnvmHDhlKlShXvPg0GzJs3TzZu3CinT5+WYcOG2f5p06bJ0KFD5Z133rFgX758+bz3adKkiRw5csS2OnXqiMfjkZYtW0qhQoVk4cKFMnbsWLumr6jOOXTokDz33HPy8ssv2/bss8/adQEAAID4IN4GC0qWLGkBg88//9y7T3/XQEGJEiW8+3QUcvjw4fLggw9KWFiYFCtWzDviqJ2BRx991H5PmzatKyPh66+/lkqVKkmaNGnkvvvuk7p168r+/ftj/XkCCUFISIj07t3bRvAdBQsWlIoVK0qePHns367eVhoQrFq1qnXw9XOgUaNG3vssW7bM9vXo0cOCh/pvdt++ffLUU09ZICJv3rx2jq+ozvn2228tw+Dpp5+WVq1ayfXr12XFihWx+KoAAAAA9068DRao9u3bu1KDJ0+eLO3atXOdo4GC6dOny7hx42THjh3y0ksv2Zf/1atXW7BhwYIFdt6ePXvk2LFj8v7779vtf/75x0YTN2/ebOnQiRIlspFPDT5E5cqVK3L+/HnXBuDuaQAhderUcvLkSQvYKR3d/+OPPywwqAEEDeypxo0b27/V8ePHy5IlS+zf/okTJ+xYihQpvD+dfY6ozvHd7xwLf18AAAAgUMXrYIF2+n/44QfrOOi2bt062+fbedfUZQ0i1KpVS3LlymWZA3qOdiiCg4NtjrLKmDGjzZXWjonSUUYdsdRRzeLFi9s1fvvtN9m5c2eU7dHOid7f2TQYAeDu9erVSzZs2GD/ljRbQOm/2QsXLsjs2bMlffr03gChBhPKli1rQT0NImhwMEOGDHZMz3d+OvscUZ3ju985Fv6+AAAAQKAKkXhMv7jrvOSpU6favGP9XTsPDk0tvnTpktSsWdN1v6tXr7qmKkTm999/lzfeeEN++uknG9V0MgoOHz4sDz30UKT36du3r2UjODSzgIABcHt2794t586ds9R//X3v3r3270enIOg0BS10qPTf88GDB737kyRJYvtfe+01adCggZw5c8YyhZwAYe7cuS2DKFOmTPaZ0L9/fzv/6NGjViAxqnMqVKhgGUUzZsywKUoaXKxRo4ZfXyMAAAAgpsTrYIEzFaFr1672+0cffeQ6dvHiRfv55ZdfWlV1X07HIyr16tWTBx54QCZOnGiF1jRYoEECDTRERa95q+sCiJxTk8D5XVc50EwgrT2g//acf989e/aUXbt2WX0BrXGgWT/q+PHjFiDQ2gKaZdCvXz/r7M+cOVM6dOhgGQe6gkrz5s3tfA1E6DQHfZzIztHggE5fGjhwoJ2v2Uj6mQAAAADEB/E+WFC7dm3rwOvIn3YUfGl1c+28azaAb5V1X86opO9yaqdOnbKRSQ0UPPLII7ZPpzsAuHc0Oyg87cyHlzJlyggrGigNGjiBA186NWH79u3RPl5U53Tq1Mk2AAAAIL6J98ECHf3TUUbn9/CdCh2F1KKGmhmgqxtomrPWNtD04zZt2thIoQYali5dKk888YSlNuvKCLoCwoQJEyRLliwWbOjTp4+fniEAAAAAADErXhc4dGjHX7fIDBkyxOYfa/FBTW3WTASdlqBLKSqdnjBo0CALBuh8ZZ3SoKnLc+bMkS1btlj6swYbRo4cGcvPCgAAAACAeyPIE1luL2KFFjjUVRGKvThOgkPD/N0cIE7aMrK1v5sAAAAAxLt+qGbVRzWonmAyCwAAAAAAwO0jWAAAAAAAAFwIFgAAAAAAABeCBQAAAAAAwIVgAQAAAAAAcCFYAAAAAAAAXELcN+EPa4a2iHbJCgAAAAAAYhOZBQAAAAAAwIVgAQAAAAAAcCFYAAAAAAAAXAgWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwYenEOKDy67MlODTM380AEMdtGdna300AAABAAkFmAQAAAAAAcCFYAAAAAAAAXAgWAAAAAAAAF4IFAAAAAADAhWABAAAAAABwIVgAAAAAAABcCBYAAAAAAICEHSw4dOiQBAUFybZt26I8Z9WqVXbO2bNn7fbUqVMlTZo0sdhKAAAAAAD8J6CCBW3btrVO/FtvveXav2jRItt/O7Jnzy7Hjh2Thx566LYft1mzZrJ37947bi8AxLRr165JuXLlJHHixJI5c2bbd/LkSalRo4YkS5ZM7r//fpkyZYrt79Wrl2TMmFGSJ08ujz/+uJw+fdr279u3T8qXLy+pU6eWli1byqVLl7xBUt9t+vTpER5/2bJlkjt3brvusGHDvPuHDh1q+/LkySNff/11rL0eAAAAuDcCKligkiZNKm+//bacOXPmru4fHBxsX7BDQkJu+z5hYWH2JRgA/E078Q0bNpQqVap4982YMUNWrlwpc+bMkeLFi0u3bt3E4/FI2rRp5fPPP5f58+fLihUr5IMPPrDzn3vuOQs26H20Y//+++9b8ODIkSO29e3b1x6ncuXKrse+ePGiBReefPJJGTNmjPTr10/Wr18va9eulf79+9u++vXr2zn//PNPrL82AAAASMDBAh09087+8OHDIxw7f/68dey/+uor1/6FCxdKypQpbfQssmkIOlKWL18+u++jjz5q5/gKPw1h//799mU5U6ZMkiJFCilTpox8++23t2z7lStXrI2+GwDcCQ109u7dW7Jly+bdlz9/fvupo/r33XefZRLo59xrr70mlSpVkscee0xCQ0Mts+Dq1avy/fffS926daV06dJStmxZ+wzU43pN3RYvXizVq1eXnDlzuh57w4YNcu7cOWnevLk0adLEPjP1vsuXL7esBt2nmVgazNVzAQAAELgCLligmQGa+vrhhx/K0aNHXcdSpUplX4BnzZrl2j9z5kxp0KCBfZkNT0fRGjVqJPXq1bMAQseOHaVPnz7RtkFH15544gkbldu6davUrl3b7n/48OFo76cBDk37dTadEgEA/9XDDz8sxYoVkyJFitjn3bvvvus6PmTIELl+/bpN5Tp16pRlHWigU+nPEydOeM/VTv7OnTvtszA85zy9jwYjNCih+3RzAhTOdX2vCQAAgMATcMECpSm4mmo7YMCACMdatWplNQw0i0Dp6P2XX35p+yPz8ccf2/zbUaNG2eicnqdfqKOjX8o1jVfrHuTNm9e+iOs1lixZEu39NLVXR+WcTQMVAPBfjRw5Un777Tcb5W/RooV06dLFgppKA6uDBw+WSZMmScmSJS3zQDv1Fy5csOP6M0OGDN5rTZ482c7RAGt4znl6Hw046GPoPt30d93nXNf3mgAAAAg8ARksUFq3YNq0abJr1y7Xfh3x17m4Tsd9wYIFlnGg0xcio/fXNFxfOnc3OvqluGfPnlKwYEGbnqAjaXqdW2UWaJqvtsV3A4A7tXv3bgs43rhxw37XTroGADR7Sj//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",
      "text/plain": [
       "<Figure size 1200x500 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "saved successfully\n"
     ]
    }
   ],
   "source": [
    "# Bar chart \n",
    "#Trade value by stock \n",
    "plt.figure(figsize=(12, 5)) \n",
    "ax=sns.barplot(x='trade_value', y='stock', data=group_value ,ci=None) \n",
    "for p in ax.patches:\n",
    "    ax.text(p.get_width()+0.5,p.get_y()+p.get_height()/2,\n",
    "            f'{p.get_width():.2f}',ha='left',va='center', fontweight='bold',fontsize=6)\n",
    "plt.title('Trade Value by Stock')\n",
    "plt.xticks(rotation=-90)\n",
    "plt.show()\n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\portfolio_mini\\python\\tvystock.png')\n",
    "print(\"saved successfully\")\n",
    "plt.close() "
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 19,
   "id": "46f91faa-3b9f-44fc-b45c-fcf0f5bb75e8",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "image/png": "iVBORw0KGgoAAAANSUhEUgAAAskAAAIYCAYAAACfV3FnAAAAOnRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjEwLjEsIGh0dHBzOi8vbWF0cGxvdGxpYi5vcmcvc2/+5QAAAAlwSFlzAAAPYQAAD2EBqD+naQAAl0xJREFUeJzt3Qd0FNX3B/CbEFIIJNQEAknovXcUQQRBsCEWwIaAKAgqoKD8VFAsKP4VUURUFERFiiLSiyC99x46oSWhJqGk7//cl51hs+m7Mzvt+zlnT7K7k93Jy2b3zpv77vWy2Ww2AgAAAAAAmfedbwEAAAAAgCFIBgAAAABwgiAZAAAAAMAJgmQAAAAAACcIkgEAAAAAnCBIBgAAAABwgiAZAAAAAMAJgmQAAAAAACcIkgEAAAAAnCBIBgDLmj59Onl5edHp06fl2+69915xMePvpje8f++//77Wu6FLPC48PgCgHQTJAGCIYE+6+Pv7U1hYGHXp0oW+/vprSkxMJD164YUXsux3bhfeTu9ee+01sa/Hjx/PdZt33nlHbLNv3z7Ss4L8TfiyZs0arXcVADTmo/UOAAAUxNixY6lKlSqUmppKMTExIogZOnQoffnll7RgwQJq2LBhoR/zueeeo169epGfn5/i+/vyyy9Tp06d5OunTp2i0aNH00svvUT33HOPfHu1atVI75555hn65ptvaObMmeJ3yMkff/xBDRo0cOnv4Em//vprluszZsyglStXZru9Tp06Ht4zANAbBMkAYAhdu3al5s2by9dHjRpFq1evpoceeogeeeQROnz4MAUEBBTqMYsUKSIuamjTpo24SHbs2CECTL7t2WefzfXnbt68SYGBgaQnrVq1ourVq4tAOKcgefPmzeIg4NNPPyW9cx77LVu2iCA5r78Ju3XrFhUrVkzlvQMAPUG6BQAY1n333UfvvfcenTlzhn777Tf5dj7lz2kMVatWFekZ5cuXp379+tGVK1cKlbd748YNEbC+/vrr2e47d+6cCLDHjRvn8v5Lz7927Vp65ZVXKCQkhCpVqiTu49+Jb6tVq5YI/suUKUNPPvlkjvt68OBBMRa8Hf/8Rx99RBkZGTk+59KlS8VMNv9eJUqUoAcffFD8fEFmk48cOUK7du3Kdh/PMPPv0bt3b0pJSRGBdLNmzSg4OFg8Dz/ff//9l+9z8N+scuXKBc7P5b85Pw//3qVLlxZnBc6ePUvu4pz0+vXr086dO6ldu3YiOP7f//4n7ktOTqYxY8aIgwY+AxEeHk4jR44Utzvi/R0yZAjNnz9fPBZvW69ePVq2bFm259uwYQO1aNFCvFb5zML333/v9u8AAO7DTDIAGBqnTHAAs2LFChowYIC4jWcGT548SX379hUBMgeBP/zwg/jKM4cFXRBVvHhxeuyxx2j27NkircNx1plnVW02mwge3cXBcLly5URwyTPJbPv27bRp0yYR+HHgy8Hxd999JwK4Q4cOybOanHrSoUMHSktLo7ffflsEpfy75jSrzikFffr0Efncn332mZgd5cds27Yt7d69O8cAVcK/5wcffCAC4qZNm8q3p6en05w5c0QgHBERQZcvX6apU6eKgJn/Hpwz/tNPP4nn3LZtGzVu3JiU8PHHH4sDpKeeeopefPFFunTpkkgJ4aCWf5eSJUu69fh8QMVnL3j8eZY5NDRUHHjwWQsOajlthlMy9u/fTxMmTKCjR4+KgNgRbzdv3jzx9+UDEs6hf/zxxyk6Oloc9DD++c6dO4u/Px8M8N+Rg3B+PgDQmA0AQMemTZtm47eq7du357pNcHCwrUmTJvL1W7duZdvmjz/+EI+zbt26bI996tQp+bb27duLi2T58uVim6VLl2Z5vIYNG2bZLj+8//w4/JzOz9+2bVtbWlpalu1z+h02b94stp8xY4Z829ChQ8VtW7dulW+Li4sTY+L4uyUmJtpKlixpGzBgQJbHjImJEds6356TFi1a2CpVqmRLT0+Xb1u2bJl4nu+//15c598jOTk5y89du3bNFhoaauvXr1+W2/nnxowZI1/v06ePLTIyMtvz8jaOH1enT5+2FSlSxPbxxx9n2W7//v02Hx+fbLfnZfDgwVkem/HflW+bMmVKltt//fVXm7e3t239+vVZbuftePuNGzdm+d18fX1tx48fl2/bu3evuP2bb76Rb+vevbvN39/fdubMGfm2Q4cOid8PH9EA2kK6BQAYHs/4Ola5cJxFTUpKErObrVu3FtdzShfICy++42oav//+u3zbgQMHREpHfnmsBcUzrs650Y6/Ay9W5JlNPsXPM6SOv8OSJUvE79ayZUv5Np6VdJ7h5tn169evixleHg/pws/LOccFSYfg35fTTNatWyffxjPLvr6+IhWE8ePxdcYzr1ev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",
      "text/plain": [
       "<Figure size 800x500 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "saved successfully\n"
     ]
    }
   ],
   "source": [
    "\n",
    " #Line chart \n",
    "# Daily trade vaue trend\n",
    "plt.figure(figsize=(8, 5)) \n",
    "sns.lineplot(x='trade_date', y='trade_value', data=daily_trades) \n",
    "plt.title('Daily Trade Value Trend') \n",
    "plt.xticks(rotation=-90)\n",
    "plt.show()\n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\portfolio_mini\\python\\Dailyvalue.png')\n",
    "print(\"saved successfully\")\n",
    "plt.close()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 20,
   "id": "02d655d1-b540-4cea-ab45-220e83f81ada",
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "C:\\Users\\A\\AppData\\Local\\Temp\\ipykernel_9120\\1548838571.py:5: FutureWarning: \n",
      "\n",
      "The `ci` parameter is deprecated. Use `errorbar=None` for the same effect.\n",
      "\n",
      "  ax = sns.barplot(x='shares', y='trade_value', data=df, ci=None, palette=\"Blues_d\")\n",
      "C:\\Users\\A\\AppData\\Local\\Temp\\ipykernel_9120\\1548838571.py:5: FutureWarning: \n",
      "\n",
      "Passing `palette` without assigning `hue` is deprecated and will be removed in v0.14.0. Assign the `x` variable to `hue` and set `legend=False` for the same effect.\n",
      "\n",
      "  ax = sns.barplot(x='shares', y='trade_value', data=df, ci=None, palette=\"Blues_d\")\n"
     ]
    },
    {
     "data": {
      "image/png": "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+usvK1WqlJUuXdoqV65sjz76qO3cudMFCidPnvRXf1LQoMBA+9RYikceecS++OIL/2uVnRX1WCjQWLlypasgpfKwOv769etdgOCNs1CJ2q1bt1qBAgXcsi1btrgeB5WLHThwoFvWuHFjy5s3r/+6vBSoKlWquEpSClbatWvnStaKAotOnTpd8+8bQAJo416rkePhjupPABA5VM1J/+ZHfeTLl8+tVzWo6Na3bt3av48FCxb4Kleu7EuZMqUvffr0voceesi3a9cu//qY9uEdY8eOHb577rnHlzVrVl+yZMlc9Sh9Zvz48f59bNmyxf85vRadQ3T7DWwS6BjRrY+pyhWA8BXbNi49FXGEngoAAABEahuXMRUAAAAAQkJQAQAAACAkzFMBACEYN26cvfHGG/bbb7+5SjzVqlXzD5aV3bt3W5cuXey7775z1Xo0qdiQIUOCqviorKjKdmoeAs1foIo8d999t40ZM8a/jcqFaoCtBs/qOPny5XPvW7Zs6dZrQK8G2W7evNmVAtWA3A4dOtizzz4b47nr899++60bwKtz04Dexx57zJ5++mm3XtdRvXr1aD/bunVrV8oUwWp1/9jCxazBHeL7FAAkIAQVABACle5MnDixq+SjKkCBNGRNZTlVpUdlOXPmzOnmA1DFHjX+NR+BynxqfoBFixa5Rr1KiKqBv3HjRv9+fv31VzdbsioFKdgoVKiQbd++3f744w9/WVJVBxKVBk2VKpVNmDDBOnfu7PZ53333RXvun3/+uZskTeu3bdtmc+fOtWeeecZSpEjhgovcuXO794Hef/99d866XgAAPAQVABCCQYMGuecePXpcFFR88803LqDQRGeaOEzlORs1amRff/21DRs2zJUeVU+HAooiRYq4bb3SnYG6devmAgr1Zrz00ksXrf/999/9pUanTp3qXq9evdqVGFUvREwUeKjnxKPAZf78+a73QkGFyocGzrI8Y8YMe+uttyx16tRuUjQAADyMqQCAq0QpS6L5CRRQiHosAtfNmjXLPadNm9bNUaAG++233+5mThb1Wqih7/VYaB6ELFmyuLSn/fv3u+XqDSlRooQdPHjQGjZsaE2bNnUBhfb38MMPx3h+gQGFnD592j3HNGuyAiHRvAUKYAAA8BBUAMBVovERkiZNGv8y7/WePXvcsxcYKGBQWpPGZOi10piUIqVAQWMkROMpNFmZSvtpcrMWLVq45XqvCdWUtqTeEfVAqMfj/vvv90+Ydjn9+/d3aVRKyXrhhRcuWq9elDlz5liSJElcWhUAAIEIKgDgKlHakzcQ23P06FH3rMa7aCZkKVasmEtdUuqRxkGoh2LmzJmuZ0JjNqRXr1728ccf24gRI9z7H374wdUPVyChsQ8aS7Fp0yYXsKi3QQOxP/roo0ueowIWpTIptUqDu5WmFV1PhVK15IEHHvDP0AwAgIegAgCuEqUfyYoVK9zgZvnll1+C1ik1Kibq1UiePLkVL1482vVJkyZ1PRLeoO6sWbO63g4FMzfffLNbtm7dOvesSYs2bNjgH9wtCkiUOvXhhx+6tKzFixe7cRRR7dy50/V+yPPPP3+F3wYAIJwxUBsAQjBlyhT3WLZsmXuvhnubNm1cD4NKx5YsWdJViFJak3on1BuhikvPPfec275jx45uO42B0HiI8+fPu8HV6sGoX7++26Z3797WrFkze+WVV1xKlKo0icZLKOioUqWK681QL4U+o2Bk9uzZbhsdVyZPnmxt27Z1pWi3bt3qlimgUEqVxnuUKlXK7V8UWHTq1Ml/jRqcraBI5WXLlSt3Tb9fAEDCQE8FAIRAYw1GjRrlr/y0b98+937ixImuoT99+nR78MEHbe3atS61qXLlym4QtsrLegO0NVZBZWX1rN4CBQYKHDQgWzTwWmlMCjRGjx5tFy5ccKlQ7733nluvOS++/PJLN/BaQcK0adPs1ltvdeVfla4Ukx07drhnBQzqrVDwoIfOPTBdSylX0rVr16v4TQIAErJEPhVSR8iURqDBkkoxSJcuXXyfDgAgHjD5HYBIbePSUwEAAAAgJAQVAAAAAELCQG0AuApavj3TwsWYp+vE9ykAAK5z9FQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAACAlBBQAAAICQEFQAAAAASLhBxbx586xBgwaWM2dOS5QokU2ZMiVovc/ns759+1qOHDksVapUVrNmTdu8eXPQNgcPHrSWLVtaunTpLEOGDNa+fXs7duxY0DarVq2yKlWqWMqUKS1Pnjw2ZMiQi87lq6++sqJFi7ptSpQoYd9+++1VumoAAAAgvMRrUHH8+HErVaqUvffee9GuV+P/7bfftuHDh9vixYstderUVrt2bTt16pR/GwUUa9eutdmzZ9u0adNcoNKxY0f/+iNHjlitWrUsX758tmzZMnvttdfspZdeso8++si/zcKFC6158+YuIFmxYoU1atTIPdasWXOVvwEAAAAg4UvkU3fAdUA9FZMnT3aNedFpqQfjueees65du7plhw8ftmzZstnIkSOtWbNmtn79eitevLgtXbrUbrvtNrfNzJkzrW7durZz5073+Q8++MBeeOEF27t3ryVPntxt06NHD9crsmHDBve+adOmLsBRUOKpWLGilS5d2gU0saHgJX369O4c1WsCILK1fHumhYsxT9eJ71NIMGp1/9jCxazBHeL7FABcB2Lbxr1ux1Rs2bLFBQJKefLogipUqGCLFi1y7/WslCcvoBBtnzhxYtez4W1TtWpVf0Ah6u3YuHGj/fPPP/5tAo/jbeMdJzqnT592X3LgAwAAAIhE121QoYBC1DMRSO+9dXrOmjVr0PqkSZNapkyZgraJbh+Bx4hpG299dAYNGuSCHO+hsRoAAABAJLpug4rrXc+ePV03kPfYsWNHfJ8SAAAAEC+u26Aie/bs7nnfvn1By/XeW6fn/fv3B60/d+6cqwgVuE10+wg8RkzbeOujkyJFCpdXFvgAAAAAItF1G1QUKFDANernzJnjX6ZxCxorUalSJfdez4cOHXJVnTw//PCDXbhwwY298LZRRaizZ8/6t1GlqCJFiljGjBn92wQex9vGOw4AAACA6zSo0HwSK1eudA9vcLZeb9++3VWDevbZZ23gwIE2depUW716tbVq1cpVdPIqRBUrVszq1KljHTp0sCVLltjPP/9snTp1cpWhtJ20aNHCDdJWuViVnv3yyy/trbfesi5duvjP45lnnnFVo4YNG+YqQqnk7K+//ur2BQAAAODSklo8UsO9evXq/vdeQ79169aubGy3bt1cqVfNO6EeicqVK7vGvyao84wZM8Y1/mvUqOGqPjVp0sTNbeHRIOpZs2bZU089ZeXKlbPMmTO7CfUC57K44447bOzYsda7d2/r1auXFSpUyJWcvfXWW6/ZdwEAAAAkVNfNPBUJHfNUAAjEPBWRiXkqAISbBD9PBQAAAICEgaACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAAACEhKACAAAAQEgIKgAAcWLr1q2WKFGiaB933XWX22bWrFlWuXJlS58+vWXIkMGaNm1qu3fvvmhfFy5csOrVq/s/P3PmTP+6PXv2WNu2bS137tyWMmVKK1u2rE2fPv2S5+bz+eydd96xW265xVKlSmW5cuWybt262dmzZy/adu/evZYtWzb/sU+dOhUn3w8AhLOk8X0CAIDwkC5dOnvmmWeCln3++ed28OBBK1y4sC1ZssTq1avnAgYFE/v377cJEybYpk2bbPny5a4B73n55ZdtwYIFFx1Dn9U+VqxYYeXKlbPatWvbuHHjrGHDhm7/WhadN954w5577jkXyDzyyCNu36+99pqdPn3a3nrrraDgQ+t1zgCA2KOnAgAQJzJlymRvvvmm/9GxY0f7559/XLDQuXNnmzhxop07d87uueceGzt2rOu10GdWrlxpX3/9tX8/avD369fPBg4ceNExNmzY4AIKmTZtmn366afuOAo2BgwYEOO5jR8/3j13797dPvroI3d8GT58uAtuPK+++qrNnTvXXnrppTj9bgAg3BFUAACuitdff93d+a9fv74VK1bMpSrJli1b7MCBA7Zu3To7duyYW+YFCgpCWrRoYTVr1nTpSVF5+5ClS5e6z69duzZoH9HxPrdq1So7ceKE/frrr+79mTNn/J//5ZdfrG/fvta/f3+788474/CbAIDwR1ABAIhz+/btsy+++MK9fv75592zehSyZ8/u0p2yZs1qJUqUcI16bxyDtGvXzo1zGD16dFA6lOemm26yhx9+2L1WylPatGnt+++/D9pHdHr27GlJkyZ1qVKpU6e2Dh06+Nfpc4cOHbLmzZtbtWrVrEePHnH6XQBAJGBMBQAgzmlQtMYrVKhQwapUqeKWaWD1+vXrXcN+x44drvdi1KhRNmfOHBdkHD582KZMmWIFCxZ0wUWgF1980Y1zUC+Gxmk0a9bMFi9e7AKEJEmSuMBF+4jJvffe6449efJkdxwNFn/ggQfs+PHj7nM//fSTG2iuAdoKVv7++2//Z++//34bPHiwC4IAAAmwp+L8+fPWp08fK1CggKvWcfPNN7ucWXWne/Ra3dU5cuRw26jLfPPmzUH70f+IWrZs6QYRapBe+/bt/V3uHnWJ63986iLPkyePDRky5JpdJwCEE6UXffDBB0G9FB4FAU888YS98sorVr58ef9gbI2z8P5t//333101p8CKThqErR4OUe+GBmsrTalr167+ylDaR+DYCz10LqLeDwUrOh+N1VDvhAIK9XQo8PGOrUBFx1UqlGfGjBlBQQYAIIH1VOjOkP7HpDtZKgOoHFiVEVQpwqefftpto8b/22+/7bZR8KEgRNVAlKvr5dAqoFAJwtmzZ7v/sWgf6ob3BuodOXLEatWq5QISDdpbvXq1u0umAETbAQBi77PPPnM3c9SIb9y4sX+5Bmnrpo3+rU2cOLFNnTrV9WaoJ6Bq1apum8CbRuKlQKlhX6dOHff6sccec/+m58uXzxYtWuT+zdaAb91g8qgXRDToWuVs1ROhylSVKlWyv/76y7755hu3XgFGmjRprFGjRkHH/vHHH11JWzl58mTQWA4AQAILKhYuXGj33XefuyMl+fPnd93mumMl+h+AKoz07t3bbSfKw1X3tbrQ1T2u7m7dxdKAvttuu83fLV+3bl0bOnSo5cyZ08aMGePufI0YMcKSJ0/uAhhVI9EgQ4IKAIg9VWHSv8uiik8KHjx6rca+egLUW6ygQNv06tXrXx2jZMmSLmXqhx9+cD0NSmNSz4f+HxET9WanSJHCVYFSL3iZMmVciVmNowAAhHlQcccdd7jSf+ryVo3z3377zXWVq7HvVRBRF7buennUi6GubN29UlChZ/U4eAGFeHfJ1M2tu2jaRnfJFFB41NuhnhJVIsmYMeNF56a7a3p41NsBAJFO/7ZGTUENXKeeg38jas+FKBDR4998TjeLNBdGbKl3I7pjAwASYFChChxqrBctWtQNxNPdJU2IpHSmwEof6pkIpPfeOj1HHbynCiDqKg/cRqlTUffhrYsuqBg0aJCrow4AAABEuut6oLZmWlVqksY+6A6Txk0oZUnP8U3lCVVBxHuokgkAAAAQia7rngpV6VBvhdKYROX8tm3b5noJWrdu7eqde/XQlS/r0fvSpUu719omcLZUb7CgBhF6n9ezPhPIe+9tE5Vyc/UAAAS79+UpFi5mvNAovk8BABKE67qnQqUAAwf5idKgNBBQlLKkRr8G7HmULqWxEqrwIXrWpEbLli3zb6PBfdqHxl5428ybN89VhvKoUlSRIkWiTX0CAAAAkECCigYNGrgxFKoUokmJNGmRBml7JQpVavDZZ591JQFVmlBlBVu1auUqOqk8oKjSiMoQavZUVY36+eefrVOnTq73Q9uJJlPSIG3NX7F27Vr78ssv7a233rIuXbrE6/UDAAAACcF1nf6k0q+ad+LJJ590KUwKAlSfPLAWebdu3dwERir9qh4JzZKqErKBNcU1LkOBRI0aNVzPR5MmTdzcFoEVo2bNmmVPPfWUlStXzjJnzuyOQTlZAAAA4PIS+aiZFyeUdqXgRIO2NXM3gMjW8u3/zfIcDsY8/b9J52IrksdU1Or+sYWLWYM7xPcpAEhAbdzrOv0JAAAAwPWPoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABASAgqAAAAAISEoAIAAABA/AQVhw4dsk8++cR69uxpBw8edMuWL19uu3btCu2MAAAAACQoSa/kQ6tWrbKaNWta+vTpbevWrdahQwfLlCmTTZo0ybZv326jR4+O+zMFAAAAED49FV26dLE2bdrY5s2bLWXKlP7ldevWtXnz5sXl+QEAAAAIx6Bi6dKl9thjj120PFeuXLZ37964OC8AAAAA4RxUpEiRwo4cOXLR8k2bNlmWLFni4rwAAAAA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166uF0HbqBrciBEjrFGjRjGem/anAKdy5cpuHNX69evtoYcecuOuEiVKFOtjAwCAYIl8XnF2hER3XVWNShPhMWcFPH0n/C8lJxz0f+h/1ZUQOy3fnmnhYszTdf7V9ve+PMXCxYwXYg5So1Or+8cWLmYN7hDfpwAgAbVx6akAAAAAEBKCCgAAAACRVVIWQMLxnxHBJaATqnfa3RXfpwAAwHWNngoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGowFXTsWNHK1GihKVPn97Spk1r5cqVs3HjxvnXb9261Zo2bWo333yz3XDDDZY5c2arXbu2LV26NGibRIkSXfSoWbNm0LFGjhxpxYsXtxQpUlju3LmtR48edvbs2Uue3+7du61Zs2aWMWNGS5UqlVWrVs0WL14ctM0vv/xiVatWdeu1XfPmzW3Pnj1x9h0BAACEg6TxfQIIXx9//LGVLVvWHnzwQVu1apULFlq0aOEa53Xq1HEBw+TJk61KlSp2991323fffWezZs2yJUuW2IYNGyxbtmz+feXKlcseeOAB//siRYr4X2sfbdu2tTRp0rggYd68eTZ48GAXVAwbNizac/P5fFavXj1buXKlVaxY0XLmzGmTJk2yGjVq2ObNmy1Hjhy2a9cu9/7EiRPWpEkT9378+PFuva5FwQ0AAAAIKnAV6S5/hQoV3Otz585Z4cKFbcuWLTZjxgwXVOj9n3/+6XoWRK/Va3Ho0CFbuHChNW7c2L+vggUL2ptvvhntcQYMGOCeX3nlFfvPf/7jAoUyZcrYe++9Zz179nQ9IFF98803brvs2bO7ICRZsmTWqFEj+/rrr10gMnToUPesgOL++++3iRMn2pkzZ9y5Llu2zKZPn27169e/St8cAABAwkL6E64aL6DwnD59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2Pz5861evXpWtGhRGz9+vDVo0MB8Pp/bZvLkyda2bVvbsWOH26f2PXjwYBdYAAAAAKEgqLjOHDhwwD788EP3eurUqTZq1CgbOHCge9+vX79oPzNs2DA7ceKE3X///TZx4kT76aefLEuWLLZs2TKbPn2622bAgAHu+ZVXXnH7VJAh7733nv3111/X6OoAAAAQjggqrjNr166106dPW8qUKa1EiRJuWcWKFd3zb7/9ZufPn7/oM8uXL3fP5cuXd8/Jkye3smXL+tedO3fOVq1aFbRN6dKlXRqUjrVu3bprdHUAAAAIRwQV15m9e/e65zRp0viXea8VHETXq3Cpz2hchT7jBSMxbQMAAABcKYKK60z27Nnd87Fjx/zLjh496p6TJk1qmTNn/lefyZEjh/tMkiRJLtrGe61tAAAAgCtFUHGdueWWW1z60qlTp2z16tX+yk5SsmRJFxxs2LDBPTSOQsqUKeOelyxZ4q8etWLFCv86BSNeKpW3jdYr9cmrLgUAAABcKYKKKDRwOX/+/G5MQ4UKFfyN8GtFA6w7duzoXjds2NDatGljffr0ce+952LFirmHd27PPfecKyU7adIke+CBB6xatWpuwLcCivr167ttevfu7Z579erl9qlB3fLEE09E2/sBAAAAxBZBRYAvv/zSunTpYi+++KIb4FyqVCmrXbu27d+//5qex9ChQ61r166uJ2Hs2LGWJ08eGzFihDVq1Cja7TXnxOzZs61y5cqu2tP69evtoYcesmnTplmiRIncNk2aNLFPPvnEbat9qjdDpWtVVhYAAAAIRdKQPh1mXn/9devQoYObz0GGDx/uGulq0F/L+RyUkvTaa6+5R3S8uScC3XnnnW6eiktp3769ewAAAABxiZ6K/6M795rXoWbNmv5liRMndu8XLVoUr+cGAAAAXM/oqfg/XtnVbNmyBS3Xew2KjkqpSXp4Dh8+7J6PHDlyDc42YTl14v9XnEro/u3P9/SJ4xYuruR3+8zJ4xF77WdPhce1X8n1nzv1vyISEXntp09auLiS3/tzZ05ZxF772f/fJoi43/uzZyxcXMnP/vy5cxbO1+4tjy5TJlAi3+W2iBC7d++2XLly2cKFC61SpUr+5d26dXMzVC9evDho+5deeinGGa4BAACAcLJjxw43Njcm9FT8H28uh3379gUt13tvHohAPXv2dIO6PRcu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uG3CUY4EdO2MqQCABDpPx4oVK9zkl9FRlZgyZcqE5fw0XHtkXrtSPT788ENr0KBBtOunTZvmJoLdvXu3hZtIvnZRet/ixYutRIkSMU4KqMkPT5w4YeHmhgR07YypAIAESBNavvHGGy79ISot0zpN/heOuPbIvPZDhw5Z/vz5Y1yvddomHEXytUuVKlWsT58+/ip/gbRMqUF33nmnhaMqCeja6akAgATo119/dfOU6C5W1DxbldrVXSvN13H77bdbuOHaI/Padd3qqVF5VZWOjtq4atWqlcst15xN4SaSr11+//13u/fee23nzp1WoUKFoN973cVXT45+7wsWLGjh5vcEdO0EFQCQQB04cMBGjhxpCxcuvGh+mnbt2oX1JGlce+Rde0JqXMW1SL52z5kzZ9wkr9H93jdq1MiSJ09u4epMArl2ggoAAJAgJJTG1dUQydeOhIGgAgAAAEBIGKgNAAAAICQEFQAAAABCQlABAAAAICQEFQAAAABCQlABAAAAICQEFQCAeNGmTRtXChMAkPARVAAAAAAICUEFACBsaOqlc+fOxfdpAEDEIagAAFxVEydOtBIlSliqVKnsxhtvtJo1a9rx48f964cOHWo5cuRw65566ik7e/asf93nn39ut912m6VNm9bNHtyiRQvbv3+/f/2PP/5oiRIlshkzZli5cuUsRYoUtmDBArtw4YINGjTIChQo4I5bqlQpdx6ef/75x1q2bGlZsmRx6wsVKmSfffbZNfxWACC8JI3vEwAAhK89e/ZY8+bNbciQIda4cWM7evSozZ8/3/UoyNy5c11Aoefff//dmjZtaqVLl7YOHTq49QowBgwYYEWKFHHBRJcuXdxYjG+//TboOD169HDByU033WQZM2Z0AcUXX3xhw4cPdwHDvHnz7OGHH3ZBRLVq1axPnz62bt06F4xkzpzZHfvkyZPx8h0BQDhI5PP+ZQcAII4tX77c9SBs3brV8uXLF7ROwYF6Gv744w9LkiSJW/bQQw9Z4sSJbfz48dHu79dff7Xbb7/dBSdp0qRxn69evbpNmTLF7rvvPrfN6dOnLVOmTPb9999bpUqV/J999NFH7cSJEzZ27Fhr2LChCyZGjBhxVa8fACIF6U8AgKtGaUc1atRw6U8PPvigffzxxy71yHPLLbf4AwpRr0VgetOyZcusQYMGljdvXpcCpV4G2b59e9BxlCLlUa+Dgod77rnHBR7eY/To0S6AkSeeeMIFLuoV6datmy1cuPCqfg8AEO4IKgAAV40ChtmzZ7s0o+LFi9s777zjUpm2bNni1idLlixoe42P0HgI0biL2rVrW7p06WzMmDG2dOlSmzx5slt35syZoM+lTp3a//rYsWPuefr06bZy5Ur/Q+lO3riKe++917Zt22adO3e23bt3u8Cna9euV/nbAIDwxZgKAMBVpUDhzjvvdI++ffu6NCgvOLiUDRs22N9//22vvvqq5cmTx5/+dDkKXjRgW70ZXs9GdDS+onXr1u5RpUoVe/755924DADAv0dQAQC4ahYvXmxz5syxWrVqWdasWd37AwcOWLFixWzVqlWX/KxSnpInT+56Nx5//HFbs2aNG7R9OUqTUq+DeiHU61G5cmU7fPiw/fzzz67XQ0GEghuN9VD6lcZgTJs2zZ0TAODKkP4EALhq1IhX5aW6deta4cKFrXfv3jZs2DCXfnQ56kkYOXKkffXVV673QT0Wse1JUPChCk+qAqVgoU6dOi4dSiVmRcFKz549rWTJkla1alWXphXT4HAAwOVR/QkAAABASOipAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAISGoAAAAABASggoAAAAAFor/BzVnr9h/KYg5AAAAAElFTkSuQmCC",
      "text/plain": [
       "<Figure size 800x500 with 1 Axes>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "saved successfully\n"
     ]
    }
   ],
   "source": [
    "# Bar chart: Trade value by shares\n",
    "plt.figure(figsize=(8, 5))\n",
    "\n",
    "# Create the bar plot with 'shares' on x-axis and 'trade_value' on y-axis\n",
    "ax = sns.barplot(x='shares', y='trade_value', data=df, ci=None, palette=\"Blues_d\")\n",
    "\n",
    "# Add a title\n",
    "plt.title('Trade Value by Shares')\n",
    "\n",
    "# Rotate x-axis labels if needed (use only if 'shares' has text labels, e.g., stock names)\n",
    "plt.xticks(rotation=-90)\n",
    "\n",
    "# Add data labels inside the bars\n",
    "for p in ax.patches:\n",
    "    height = p.get_height()  # height of each bar (trade value)\n",
    "    ax.text(p.get_x() + p.get_width() / 2,  # x-position of label\n",
    "            height,  # y-position (top of the bar)\n",
    "            f'{height:.2f}',  # format the label with two decimal places\n",
    "            ha='center', va='bottom', fontsize=9, fontweight='bold')\n",
    "\n",
    "# Display the plot\n",
    "plt.tight_layout()\n",
    "plt.show()\n",
    "plt.savefig(r'C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Portfolio_Freelance\\projects\\portfolio_mini\\python\\radevaluebyshares.png')\n",
    "print(\"saved successfully\")\n",
    "plt.close()\n",
    "\n"
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
