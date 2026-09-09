   UPDATE 9/9/2026
    total rewrite

    New design
    A tokenized mathematical expression parser backed by an expression tree/AST.
        - addressed lack of seperation of concerns within the code
        - dramatically simplifies the logic
        - helps with the issue of desynchronization between state
        - improves handling mathematical expressions
        - resolved issues with repeated equals, functions, and result presentation
        - new backend is verified but history and memory are not yet complete so will be using old backend until finished - 9/9/2026


   PREVIOUS 10/21/2021

   A standard Javascript Calculator based around the functionality of the windows calculator.
        
        Things I Learned:
            
            -how to change the format of a number from a string with commas and scientific notation to a number variable and back
            
            -regex exclusions
            
            -Limiting the length of numbers in scientific notation and decimal form

            -keyboard functionality / detecting combination key presses

            -animated dropdown icon

            -dropdown menus

            -fixed headers and footers

            -HTML codes

            -svg implementation

            -CSS organization + table of contents for ease of use
    
   functions include: sqrt of x; 1 divided by x; x squared; percent; memory keys;  history; clearing; backspace; add; subtract; multiply; divide; decimal; and inverse

   keyboard functionality with hotkey menu

        How Percent key functions: 
        
            if entering variable 'a' 
                percent key result will display 0;
                    (result = 0)
        
            while using multiply or divide
            if entering variable 'b' and the current number is between 0 and 100
                percent key result will display the current number percent of variable 'a'; 
                    (result = x %of a)
            else 
                percent key result will display the current number as a percent; 
                    (result = x%)

            while using addition
            percent key result will display variable 'a' plus the current number percent of variable 'a'; 
                (result = a + (x %of a))

            while using subtraction
            percent key result will display variable 'a' minus the current number percent of variable 'a'; 
                (result = a - (x %of a))



