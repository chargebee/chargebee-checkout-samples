function setActive(el) {
  el.classList.add('ch-nav__item--active');
}

var menu = document.createElement('div')
menu.innerHTML = `
<div class="ch-menu">
          <div class="ch-nav">   
              <div class="ch-nav__aide">
                  <label class="ch-select">
                      <span class="ch-select__label">Develop with</span>
                      <select class="ch-select__control" id="lib-chooser">
                          <option selected value="jquery">JQuery</option>
                          <option value="angular">Angular</option>
                          <option value="react">React</option>
                          <option value="vue">Vue</option>
                      </select>
                  </label>        
              </div>
              <div class="ch-nav__main">                    
                  <a id="example1" class="ch-nav__item" href="javascript:void(0)" >
                      Example #1
                  </a>
                  <a id="example2" class="ch-nav__item" href="javascript:void(0)" >
                      Example #2
                  </a>
                  <a id="example3" class="ch-nav__item" href="javascript:void(0)" >
                      Example #3
                  </a>                  
              </div>
              <div class="ch-nav__mobile">
                <label class="ch-select">
                    <span class="ch-select__label">Demo</span>
                    <select class="ch-select__control" id="example-chooser">
                        <option value="example1">Example 1</option>
                        <option value="example2">Example 2</option>
                        <option value="example3">Example 3</option>
                    </select>
                </label>
              </div>
          </div>
      </div>`
document.body.appendChild(menu)

var source = document.createElement('div')
source.classList.add('view-source')
source.innerHTML = `  
  <div id="source-contents">
  </div>
  <br>
  <a id="source-link" href="#" target="_blank">
    View Source
  </a>
`
document.body.appendChild(source);

function getGithubSource(example, lib) {
  switch(lib) {
    case 'jquery': {
      return `https://github.com/chargebee/chargebee-checkout-samples/tree/master/components/jquery/${example}#readme`
    }
    case 'vue': {
      return `https://github.com/chargebee/chargebee-checkout-samples/tree/master/components/vue/cb-components-examples/src/components/${example}#readme`
    }
    case 'react': {
      return `https://github.com/chargebee/chargebee-checkout-samples/tree/master/components/react-app/src/components/${example}#readme`
    }
    case 'angular': {
      return `https://github.com/chargebee/chargebee-checkout-samples/tree/master/components/angular-app/src/app/${example}#readme`
    }
  }
  return 'javascript:void(0)'
}

function setSourceCodeContents(example) {
  let div = document.getElementById('source-contents')
  switch(example) {
    case 'example1': {
      div.innerHTML = `
      <ul>
        <li>Initializing chargebee.js</li>
        <li>Setting up Chargebee components in fields-mode</li>
        <li>Style customization</li>
        <li>Font customization</li>
        <li>Input Placeholder customization</li>
        <li>Setting locale</li>
        <li>Creating chargebee token on submit</li>
      </ul>
      `
      break;
    }
    case 'example2': {
      div.innerHTML = `
        <ul>
          <li>Set up Chargebee components in combined-mode</li>
          <li>Enable/Disable card icon</li>
          <li>Perform programmatic actions</li>
          <li><ul>
            <li>Focus on field</li>
            <li>Clear all fields</li>
            <li>Update styles dynamically</li>
          </ul></li>
        </ul>
      `
      break;
    }
    case 'example3': {
      div.innerHTML = `
        <ul>
          <li>Set up event listeners</li>
          <li><ul>
            <li>on ready</li>
            <li>on focus</li>
            <li>on blur</li>
            <li>on change</li>
          </ul></li>
          <li>Handling validation errors</li>
        </ul>
      `
      break;
    }
  }
}

function setGitLink(exampleId, library) {
  var a = document.getElementById('source-link');
  a.href = getGithubSource(exampleId, library)
}

function init() {

  var pathname = window.location.pathname;
  var url_chunks = pathname.split('/').filter(a => a);
  var exampleId = window.location.hash.replace('#','').split('/').filter(a => a).pop() || url_chunks.pop() || '';
  var library = url_chunks.pop() || 'jquery';

  var anchor = document.querySelector(`#${exampleId}`)
  setActive(anchor);
  var libChooser = document.getElementById("lib-chooser")
  libChooser.value = library
  var exampleChooser = document.getElementById("example-chooser");
  exampleChooser.value = exampleId;

  setGitLink(exampleId, library);
  setSourceCodeContents(exampleId);

  function loadExample() {
    var exId = document.querySelector('.ch-nav__item--active').id;
    var lib = libChooser.options[libChooser.selectedIndex].value;
    
    let lib_url = '';
    let example_path = ''

    switch(lib) {
      case 'jquery': {
        lib_url = 'jquery/'
        break;
      }
      case 'react': {
        lib_url = 'react/#/'
        break;
      }
      case 'angular': {
        lib_url = 'angular/#/'
        break;
      }
      case 'vue': {
        lib_url = 'vue/#/'
        break;
      }
    }

    switch(exId) {
      case 'example1': {
        example_path = 'example1/'
        break;
      }
      case 'example2': {
        example_path = 'example2/'
        break;
      }
      case 'example3': {
        example_path = 'example3/'
        break;
      }
    }
    
    setGitLink(exId, lib);
    setSourceCodeContents(exId);

    const finalUrl = `${window.location.origin}/${lib_url}${example_path}`;
    window.location.replace(finalUrl)
  }

  Array.from(document.querySelectorAll('.ch-nav__item')).map(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector('.ch-nav__item--active').classList.remove('ch-nav__item--active');
      setActive(e.target);
      loadExample();
      return false;
    })
  })

  document.getElementById("lib-chooser").addEventListener('change', function(e) {
    loadExample();
  });

  document.getElementById("example-chooser").addEventListener('change', function(e) {
    let selectedExample = document.getElementById("example-chooser").value;
    let exampleLink = document.getElementById(selectedExample);
    exampleLink.click();
  });
}

init();