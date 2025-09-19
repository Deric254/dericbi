{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "ee50d285-bcb9-4687-8d9e-9f409f14dacd",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "✅ Saved full dirty dataset to C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\Raw_datasets\\python-generated-files\\dirty_sales.csv\n"
     ]
    }
   ],
   "source": [
    "\"\"\" generates a dirty csv with 100000 rowsvery dirty for python practice \"\"\"\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "import random\n",
    "\n",
    "# ------------------ 1. Generate Dirty Data ------------------\n",
    "\n",
    "def random_name():\n",
    "    base = random.choice(['john', 'mary', 'peter', 'lucy', 'kevin', 'linda'])\n",
    "    return random.choice([base.upper(), base.lower(), base.title(), base + '  '])\n",
    "\n",
    "def random_product():\n",
    "    base = random.choice(['Shoe', 'Bag', 'Phone', 'Watch', 'Laptop'])\n",
    "    typo = random.choice(['Shoee', 'Bagg', 'Phne', 'Wacth', base])\n",
    "    return random.choice([base, typo, base + ' '])\n",
    "\n",
    "def random_quantity():\n",
    "    return random.choice([None, random.randint(1, 10)])\n",
    "\n",
    "def random_price():\n",
    "    return random.choice([round(random.uniform(10, 500), 2), 'Free', 'NaN'])\n",
    "\n",
    "def random_date():\n",
    "    year = random.choice([2022, 2023, 2024])\n",
    "    month = random.randint(1, 12)\n",
    "    day = random.randint(1, 28)\n",
    "    return f\"{year}-{month}-{day}\" if random.random() > 0.05 else None\n",
    "\n",
    "def random_gender():\n",
    "    return random.choice(['M', 'F', 'Male', 'female', 'FEMALE', 'm'])\n",
    "\n",
    "def generate_row():\n",
    "    return [\n",
    "        random_name(),\n",
    "        random_product(),\n",
    "        random_quantity(),\n",
    "        random_price(),\n",
    "        random_date(),\n",
    "        random_gender()\n",
    "    ]\n",
    "\n",
    "# 🌊 Generate 100,000 messy rows\n",
    "data = [generate_row() for _ in range(100000)]\n",
    "df = pd.DataFrame(data, columns=['Customer', 'Product', 'Quantity', 'Price', 'SaleDate', 'Gender'])\n",
    "\n",
    "# 🔁 Add 10% duplicate rows\n",
    "df = pd.concat([df, df.sample(frac=0.1)], ignore_index=True)\n",
    "\n",
    "# 🧃 Add junk columns\n",
    "df['Extra'] = 'noise'\n",
    "df['Unnamed: 0'] = np.arange(len(df))\n",
    "\n",
    "# 🔀 Shuffle everything\n",
    "df = df.sample(frac=1).reset_index(drop=True)\n",
    "\n",
    "# 💾 Save to CSV in your location\n",
    "output_path = r\"C:\\Users\\A\\OneDrive\\Desktop\\Master_plan\\Data_Analysis_Camp\\Data_Analyst_plan\\Learning_phase\\datasets\\Raw_datasets\\python-generated-files\\dirty_sales.csv\"  # Change to your EXES path if needed\n",
    "df.to_csv(output_path, index=False)\n",
    "\n",
    "print(f\"✅ Saved full dirty dataset to {output_path}\")\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "2ad2ddb6-feb7-4644-bd2a-bcf2efc17830",
   "metadata": {},
   "outputs": [],
   "source": []
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
