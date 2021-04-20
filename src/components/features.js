export const Features = () => {

  const features = [{
    "icon": "fa  fa-sort-amount-desc",
    "title": "Top Down Approach",
    "text": "Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam."
},
{
    "icon": "fa  fa-bullseye",
    "title": "Intuitive Screening",
    "text": "Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam."
},
{
    "icon": "fa fa-arrows-h",
    "title": "Wide Coverage",
    "text": "Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam."
},
{
    "icon": "fa fa-sitemap",
    "title": "Economic Analysis",
    "text": "Lorem ipsum dolor sit amet placerat facilisis felis mi in tempus eleifend pellentesque natoque etiam."
}];

  return (
    <div id='features' className='text-center'>
      <div className='container'>
        <div className='col-md-10 col-md-offset-1 section-title'>
          <h2>Features</h2>
        </div>
        <div className='row'>
          {features.map((d, i) => (
                <div key={`${d.title}-${i}`} className='col-xs-6 col-md-3'>
                  {' '}
                  <i className={d.icon}></i>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}
