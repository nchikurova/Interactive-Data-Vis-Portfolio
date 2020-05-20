# Project 2. Narrative Visualization

To explore the project click [here](https://nchikurova.github.io/Interactive-Data-Vis-Portfolio/project_2/narrative_project/).

To view a short screen recording click [here](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/project_2/sketches/project_2.mov).

To view screenshot of a project click [here](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/project_2/sketches/project_2_pic.png).

## 1. Prospectus

Born and raised in Russia, I notice that some traditions have been changing over time. And, after another question from my mom: "Where are my grandchildren?", I decided to take a look at the Russian fertility data over time. Analyzing fertility tables and the age of women at birth from 1970 to 2020, I found out that the average age of women in Russian at their first birth had increased. I am not the one in my late 20s, who does not have kids yet. The average age of women at first birth in Russia started increasing after the 2000s despite the traditions.

## 2. Sketches and Mockups

[Structural Architecture](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/project_2/sketches/sketch_project2.png)

## 3. Exploring data and Data sources:

This article is a short version of my research paper, where I took the data from the sources listed below and made analysis myself by comparing, exploring, and combining the data of the Russian population over time, Fertility tables, Cohort tables, and Total Fertility Rates tables.

I decided to include the line chart of Total Fertility Rates of some Eastern European countries to show an overall picture of fertility decline in the late 1990s; line chart of proportions of women by birth order (1979, 1989, 2002, and 2010 were the years with the most updated information and the least missing values); and the bar graph of the numbers of birth by 5-year age group of the mother. 

[Humanfertility.org](https://www.humanfertility.org/cgi-bin/country.php?country=RUS&tab=si)

[Population.un.org](https://www.un.org/en/development/desa/population/index.asp)

[World Bank, 2019. Data catalog. World Development Indicators (Russian Federation)](https://datacatalog.worldbank.org/dataset/population-estimates-and-projections)


## 4. Reflection and Iteration

The purpose of this arcticle is to introduce this topic to the viewer and give general information. For someone, who would be interested to learn more I linked few articles and research paper in the introduction.

My first draft included long narrative part. I was advised to think who was my audience and make some changes after answering this question. I think this article would be most inetersting for generation of women in thier 20s and 30s, so I decided to change the scientific approach to more simple, easily readable, and interactive way of displaying the information given in my article. 

After getting feedback, I left only two visualizations unchanged: the line charts of proportion of women by birth order and the number of births by 5-year age group. 

Each of the line charts of proportions of women by birth order in 1979, 1989, 2002, and 2010 had 5 different lines (for 1st birth, 2nd birth, 3rd, 4th, and 5th + births) with different color for each line, representing how the proportion of women would change over time. The purpose of these charts was to show the viewer a difference in between given years, so I wanted the viewer to see all of them at the same time, that is why I decided to make four separate charts instead of letting user to interact with them through the dropdown menu or buttons and choose one at the time. Adding grind lines helped to show the data points displayed in x-axis and y-axis.

The bar graph in my opnion was the best way to represent the number of births by 5-year age group of the mother. I came across orange-purple color scheme online and decided to use it for this visualization. By adding mouse over event I let user to highlight one group at the time and see how it has changed through the the years, and what is the exact number of the births at that exact period of time.

For Fertility Rates line chart, at fisrt, I used black color with thicker stroke for Russian Federation and grey color for all other countries. I getting a feedback of changing it to bright colors, I thought that I can visually separate different parts of the arctile by adding a background color and match it with charts color; also I decided to name each of the parts with a title and let the users choose if they want just look at the visualizations or read that part of the article. I added the title and horiszontal lines to visually divide the whole article to few parts.

The linechart for First Births I changed completely and for that, I had to rearrange data. That fact made the process of creating this project even more interesting, since I realized how important is the way data is set up and how many of the ways to work with different data sets. I made this chart using exmaple from the class, but I tried to design it as close as possible to the theme of my project.

Adding cartoon images was the initial idea in order to make this article more playful. I decided to use my mom's question "Where are my grandchildren?" as a title and add "grumpy lady" picture representing moms around the world who can't wait to become grandmothers. To answer this question by the end I decided to place image of happy family with a title of "There will be grandchildren, mom.. just a little later :)" I think it fits perfectly.

## 5. Improvement and goals for future

## To make this project perfect I would:

- change design of a header. Somehow I think it looks empty. I tried to add boarders and different types of lines, and background images, but nothing was good enough.
- replace the dropdown menu in Firts Births chart with checkboxes (so user can not only see them separately but compare few of them by the same time, for example 1979 and 2010)
- expand this project to Worldwide view

