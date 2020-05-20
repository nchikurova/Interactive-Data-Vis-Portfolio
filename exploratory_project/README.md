# Project 1. Exploratory Visualization

To explore the project click [here](https://nchikurova.github.io/Interactive-Data-Vis-Portfolio/exploratory_project/).

To view a short screen recording click [here](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/lib/sketches/project_1.mov).

To view screenshot of a project click [here](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/lib/sketches/project_1_pic.png).

## 1. Prospectus

*This project was made in the Spring of 2020.

In connection with the current situation of COVID - 19 (Coronavirus) in the world, I decided to look back and see what other epidemic diseases had threatened the human race for the past years. One of the most dangerous and rapidly spread viruses was Ebola in 2013 - 2016 years. The data I will use for my project was found in [Kaggle.com](https://www.kaggle.com). 

With a final number of 28,616 infected people, including 11,310 deaths (case-fatality rate of 40%), The Western African Ebola virus epidemic (2013 – 2016) was the most widespread outbreak of Ebola virus disease (EVD) in history—causing major loss of life and socioeconomic disruption in the region, mainly in Guinea, Liberia, and Sierra Leone. [Ebola Outbreak Dataset](https://www.kaggle.com/imdevskp/ebola-outbreak-20142016-complete-dataset)

How fast was EVD distribution among the countries provided in the dataset? What is the percentage of the number of confirmed deaths comparing to probable/suspected deaths, as well as confirmed cases to possible cases? How long did it take these countries and the rest of the world to recover from the EVD epidemic? How far was the peak of the disease from the end of it?

Even though Coronavirus and Ebola are not the same epidemic cases, I think some of the answers of those questions will help people nowadays to understand what to expect and how to react towards such cases, as well as understanding and realization of how strong and smart we are together to live through this. 
I am planning to find more datasets that will describe how the governments and people themselves were fighting with the virus, and what was the most helpful.

[Acknowledgements](https://www.who.int/csr/don/archive/disease/ebola/en/)

[Collection methodology](https://github.com/imdevskp/ebola_outbreak_dataset)

## 2. Sketches and Mockups

[Structural Architecture](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/lib/sketches/arch_diagram_project1.png)

Initial sketches: [map and scatter plot](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/lib/sketches/IMG_7447.jpeg),[ bar charts](https://github.com/nchikurova/Interactive-Data-Vis-Portfolio/blob/master/lib/sketches/IMG_7448.jpeg)

## 3. Exploring data

The data includes the name of the country, the date of the report, the number of suspected, probable and confirmed and its total of cases, the number of suspected, probable and confirmed, and its total of deaths. Initially, I wanted to find a correlation between suspected and confirmed cases/deaths and what was the proportion of suspected and probable cases/deaths considered in relative to a number of confirmed cases/deaths. By taking a closer look of the data, I realized that the logic of adding up cases each day was followed only in the "Total" column, and visualizations and analysis of suspected and probable cases and deaths did not come out as expected. So, in my project, I explored the number of Total cases and the number of total Deaths and its relationship.

Also, I decided to analyze and visualize this data to learn and provide more information about the Ebola outbreak in general. As I have heard, the virus was spread around the world. However, exploring data I found out that the number of cases and deaths in most of the countries was significally small comparing to Liberia, Guinea, and Sierra Leone. My project is mostly focused on these three countries.

Since the data I found had longitude and latitude of each country,the map was the first data visualization that came to my mind. Because the numbers of three selected above countries were thousands of times higher than the others, the world map had to be changed to an Africa map. I think it is very important to show people where these countries are located at least in order to teach them a little about geography.

## 4. Reflection and Iteration

I had three visualizations in my mind: bar chart that will show the differences between the numbers of total cases and total deaths, scatter plot that will explain how fast these numbers were growing through the time and map where the viewer can see these countries location. 

For the background color, I chose one of the grey shades. I did not want to leave it white and it would not be appropriate to use a bright color such as yellow for example. This topic contains death numbers and I thought that using dark red ("brown" for HTML colors) would consciously and subconsciously bring this association to the viewer's mind. Visually I did not want to use a lot of colors, since it is a serious topic, but I wanted to make it pleasable to look at. So, I decided to use a dark grey for the number of total cases and leave black color for text.

Initially, circles were showed on the map where the center of circles would represent the centers of epidemic and radius - how widely this epidemic was spread. Since the size of Liberia, Guinea, and Sierra Leone are relatively small in Africa map and are located next to each other, I was advised by classmates and a teacher to place circles separately from the map. When I tried to do that, I liked the result and left it the suggested way. Also, I made the map "almost invisible" by placing it under the text and table and give the borders white color. Most of the counties are not filled with color except Liberia, Guinea, Sierra Leone, Nigeria, and Mali where the country with lower numbers has a lighter grey fill and the country with higher numbers - darker, respectively.

The text with "Other affected country" initially was made by separate HTML elements and the numbers would not align with each other. At that point, I did not even think about the table, and when I finally walked out of this project for a few days, when I came back I clearly realized it has to be changed. I made a small table as a separated JavaScript file and placed it on the top of the map. It fits perfectly in this project and proves one more time how important is to sometimes leave your project for a while and come back to it with a "fresh eye". I also added hover over element; the row of the tables is changing its color when the mouse is over it.

## 5. Improvement and goals for future

“The more you know, the more you know you don't know.”

― Aristotle

The thought of "how much I don't know and what I can't do yet" I am trying to turn into "wow, that is exciting how much room for an improvement I have" :) . Even though it doesn't work sometimes, I can clearly see how I have developed my skills since the first day of this class. As smart people say: "Don't try to be better than the others, try to be better than yourself yesterday".

I have spent hours on both projects and considering that I did not know any single line of Javascript and d3, or HTML I think it is pretty impressive. However, I do think it could be better. It is either because of the lack of skills, time, or energy, this project is not perfect. 

## To make this project perfect I would:

- make all elements interactive and connected to the dropdown menu
- replace the dropdown menu with either radio buttons or checkboxes (since it is only three countries and it is possible to show the viewer all options at once)
- make a map more interactive by adding hover over the surface area, and fixing the bug in hover over borders
- brainstorm and add the idea for displaying proportions and percentage of affected people comparing to the population in each country
- change scatter plot to line chart where I could display tooltip by using ClosestDate and bisect function
- debug Guinea circle tooltip (the tooltip are not showing maybe because the radius is too small and all circles are on a top of each other)
- replace separate HTML div containers that represent lines connected circles and countries on a map by adding them to code ( so each line will show up only when the country is chosen)
- brainstorm and improve the idea of showing "2015 <--- 2014 ---> 2015" HTML element for representing the growth of numbers over time
- brainstorm the ideas and add the answer on question from Prospectus "How the governments and people themselves were fighting with the virus, and what was the most helpful"
