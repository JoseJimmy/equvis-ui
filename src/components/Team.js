export const Team = () => {

 const Team =  [{
    "img": "img/team/01.jpg",
    "name": "Jose",
},
{
    "img": "img/team/02.jpg",
    "name": "Vivek",
}
]

  return (
    <div id='team' className='text-center'>
      <div className='container'>
        <div className='col-md-8 col-md-offset-2 section-title'>
          <h2>Meet the Team</h2>
          <p>
          Equvis is lead by Jose and Vivek, both of whom are passionate about build tools that make real change to people's lives
          </p>
        </div>
        <div id='row'>
          {Team.map((d, i) => (
                <div key={`${d.name}-${i}`} className='col-md-6 col-sm-6 team'>
                  <div className='thumbnail'>
                    {' '}
                    <img src={d.img} alt='...' className='team-img' />
                    <div className='caption'>
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
              ))
        }
        </div>
      </div>
    </div>
  )
}
