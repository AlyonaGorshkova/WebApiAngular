using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Linq.Expressions;
using WebApiBack.Models;

namespace WebApiBack.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ActiviryController : ControllerBase
    {
        private readonly ILogger<ActiviryController> _logger;

        private static readonly List<Models.Activity> _activities = new();

        public ActiviryController(ILogger<ActiviryController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult PostActivity([FromBody] Models.Activity activity)
        {
            _activities.Add(activity);
            _logger.LogDebug("Данные по активности переданны");
            return Ok();
        }
        [HttpGet]
        public IActionResult GetActivity()
        {
            try
            {
                if (_activities == null || !_activities.Any())
                {
                    _logger.LogInformation("Список активностей пуст");
                    return NotFound("Список активностей пуст");

                }

                return Ok(_activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка активностей");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
        [HttpGet("{_id}/sessions")]
        public IActionResult GetUserSession(string _id)
        {
            try
            {
                var sessions = _activities.Where(a => a._id == _id).ToList();
                if (!sessions.Any())
                {
                    _logger.LogInformation("Не найдены сессии");
                    return NotFound("Сессии не найдены");
                }
                return Ok(sessions);
            } catch (Exception ex)
            {
                _logger.LogError(ex.Message + " Ошибка при получении сессий устройства");
                return StatusCode(500, "Ошибка сервера");
            }
        }
        [HttpDelete]
        public IActionResult DeleteOldActivities([FromQuery] DateTime TimeBefore)
        {
            try
            {
                _logger.LogInformation("Получен запрос на удаление записей старше {TimeBefore}", TimeBefore);

                var countBefore = _activities.Count;
                _activities.RemoveAll(a => a.startTime < TimeBefore);
                var countRemoved = countBefore - _activities.Count;

                _logger.LogInformation("Удалено {CountRemoved} записей", countRemoved);
                return Ok(new
                {
                    message = $"Удалено {countRemoved} записей",
                    countRemoved = countRemoved
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении записей");
                return StatusCode(500, "Ошибка при удалении");
            }
        }


    }
}
