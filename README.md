# sierra-forrester-sample
A sample page on how to use the script for the Forrester ROI calculator.

## The script file
There used to be a script for handling the cascading drop down files (country/state and industry/application).
This script is now moved to a new file (elq-form.js) and is combined with a new script that takes care of the tracking parameters.

## How tracking parameters are handled?
A URL pointing to the Forrester page is expected to be tracked with tracking parameters as below:

http://page-address?lsc=1&campaigntype=2&utm_source=3&utm_medium=4&utm_campaign=5&cid=6

If any of the values above are missing, then a default value is going to be used.


## How to use these files in actual project?
1. Copy the Form HTML from the index.html file.
1. Replace it with existing page.
1. Remove the cascading drop down script that was sent to you on October 9th.
1. Reference the elq-form.js after a reference to jquery in your page.
1. That's it! Enjoy!