<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Putting User Input into JS Objects</title>
    <style>
        .formBox{
            padding: 0.5rem 2rem;
        }
    </style>
</head>
<body>
    <form>
        <div class="formBox">
            <label for="kindDeed">Kind Deed</label>
            <input type="text" id="kindDeed" placeholder="Kind Deed"/>
        </div>
        <div class="formBox">
            <button id="btn">Click to Add</button>
        </div>
        <div id="msg">
            <pre></pre>
        </div>
    </form>
    <script>
        let kindDeed = [];
        const addDeed = (ev)=>{
            ev.preventDefault();  //to stop the form submitting
            let deed = {
                id: Date.now(),
                kindDeed: document.getElementById('kindDeed').value
            }
            kindDeed.push(deed);
            document.forms[0].reset(); // to clear the form for the next entries
            //document.querySelector('form').reset();
            //for display purposes only
            console.warn('added' , {kindDeed} );
            let pre = document.querySelector('#msg pre');
            pre.textContent = '\n' + JSON.stringify(addDeed, '\t', 2);
            //saving to localStorage
            localStorage.setItem('addKind.txt', JSON.stringify(addDeed) );
        }
        document.addEventListener('DOMContentLoaded', ()=>{
            document.getElementById('btn').addEventListener('click', addDeed);
        });
    </script>
</body>
</html>
