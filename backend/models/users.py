from dataclasses import dataclass
# from typing import Optional
from datetime import datetime

@dataclass
class User:
    username: str
    full_name: str = ""
    age: int = 0
    email: str = ""
    phone: str = ""
    role: str = ""
    
   
    
