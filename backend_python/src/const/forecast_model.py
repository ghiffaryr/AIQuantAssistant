class ForecastModel:
    class AutoTS:
        code = "autots"
        name = "AutoTS"
    
    class FacebookProphet:
        code = "facebookprophet"
        name = "Facebook Prophet"
        
    class NeuralProphet:
        code = "neuralprophet"
        name = "Neural Prophet"

ForecastModelList = [{"code":c.code, "name": c.name} for c in vars(ForecastModel).values() if isinstance(c, type(ForecastModel))]